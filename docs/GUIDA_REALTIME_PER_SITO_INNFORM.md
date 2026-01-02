# Guida Realtime Broadcast - Diagnosi e Soluzioni

**Data:** 30 Dicembre 2025
**Versione:** 4.0
**Stato:** In attesa fix EduPlan

---

## DIAGNOSI CONCORDATA

### Causa: Race Condition

Il broadcast arriva al sito PRIMA che il database Supabase abbia sincronizzato la modifica su tutte le repliche.

```
Timeline del problema:
─────────────────────────────────────────────────────────────────────
0ms   Admin clicca "Elimina edizione"
50ms  DELETE confermato da Supabase
52ms  Broadcast inviato SUBITO
70ms  Sito riceve broadcast
71ms  Sito chiama API
80ms  API legge da replica NON ancora aggiornata → 2 edizioni
─────────────────────────────────────────────────────────────────────
```

### Evidenza
- Test curl dopo qualche secondo: 1 edizione (corretto)
- Chiamata dal sito subito dopo broadcast: 2 edizioni (sbagliato)

---

## FIX RICHIESTO: EduPlan deve aggiungere delay prima del broadcast

```typescript
// In CourseEditionsManager.tsx, dopo delete/update
if (course?.status === 'published') {
  setTimeout(() => {
    broadcastService.notifyCoursesUpdated(courseId);
  }, 500);  // 500ms di delay
}
```

Questo da tempo al database di sincronizzarsi prima di notificare il sito.

---

## STATO ATTUALE

| Componente | Stato | Note |
|------------|-------|------|
| EduPlan - Delete edizione | OK | DELETE awaited |
| EduPlan - Broadcast | **FIX RICHIESTO** | Troppo veloce |
| EduPlan - Edge Function | OK | Nessuna cache interna |
| Sito - Ricezione broadcast | OK | Funziona |
| Sito - Chiamata API | OK | forceRefresh + delay 5s |

---

## BACKUP GIA' IMPLEMENTATO SUL SITO

Il sito ha gia' un delay di 5 secondi prima di chiamare l'API dopo il broadcast.
Se EduPlan aggiunge 500ms prima del broadcast, il problema sara' risolto.

---

## COME TESTARE DOPO IL FIX

1. Apri `http://localhost:3002/corsi/corso-ai`
2. Apri Console (F12)
3. Su EduPlan, elimina un'edizione
4. Il sito deve aggiornarsi automaticamente con il numero corretto

---

*Guida aggiornata 30/12/2025 ore 20:15*
