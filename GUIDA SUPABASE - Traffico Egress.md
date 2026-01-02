Ecco uno schema strutturato della pagina "Manage Egress usage" basato sulle fonti fornite:

### **1\. Definizione e Panoramica**

* **Cos'è l'Egress:** È il traffico dati trasmesso dal sistema verso un client connesso 1\.  
* **Servizi coinvolti:** L'egress viene generato da Database, Auth, Storage, Edge Functions, Realtime e Log Drains 1\.

### **2\. Tipologie di Egress (Dettaglio per Servizio)**

Ogni servizio contribuisce all'egress in modo specifico:

* **Database Egress:** Dati inviati al client quando si recuperano informazioni dal database (tramite API PostgREST) 1, 2\.  
* **Shared Pooler Egress (Supavisor):** Dati inviati quando si usa il connection pooler condiviso. *Nota:* Non viene conteggiato come "Database Egress" per evitare doppi addebiti 2, 3\.  
* **Auth Egress:** Dati inviati durante la gestione utenti (login, logout, recupero profili, token) 2, 4\.  
* **Storage Egress:** Dati inviati durante il download di file (es. immagini, PDF) dai bucket di storage 4\.  
* **Edge Functions Egress:** Dati inviati al client come risposta all'esecuzione di una Edge Function 5\.  
* **Realtime Egress:** Dati inviati ("push") ai client sottoscritti a eventi in tempo reale 5\.  
* **Log Drain Egress:** Dati inviati a destinazioni di log esterne (l'opzione GZIP può ridurne il volume) 3, 6\.  
* **Cached Egress:** Dati serviti tramite CDN (cache hits), tipicamente per lo Storage 6\.

### **3\. Calcolo dei Costi e Piani**

* **Unità di misura:** L'egress è addebitato per Gigabyte (GB) 6\.  
* **Unified Egress Quota:** Una quota unica condivisa tra tutti i servizi 6\.  
* **Prezzi (per eccedenza):**  
* **Uncached Egress:** $0.09 per GB 7\.  
* **Cached Egress:** $0.03 per GB 7\.  
* **Quote per Piano:**  
* *Free:* 5 GB Uncached / 5 GB Cached 7\.  
* *Pro / Team:* 250 GB Uncached / 250 GB Cached 7\.  
* *Enterprise:* Personalizzato 7\.  
* **Fatturazione:** Si paga solo l'utilizzo che eccede la quota del piano 6, 8\. Le voci appaiono separatamente in fattura come "Egress" e "Cached Egress" 7\.

### **4\. Monitoraggio e Debug**

* **Visualizzazione Utilizzo:**  
* Pagina "Usage" dell'organizzazione (totale o per progetto) 9\.  
* Creazione di report personalizzati (Custom Reports) nella sezione Observability 9\.  
* **Strumenti di Debug:**  
* **Query Performance:** Per vedere le query più frequenti e le righe restituite 10\.  
* **Logs Explorer:** Per identificare gli endpoint API più richiesti (Edge Logs) 10\.

### **5\. Ottimizzazione**

Strategie per ridurre il consumo di Egress:

* Ridurre il numero di campi o voci selezionate nelle query 11\.  
* Ottimizzare il codice client e usare cache per ridurre le chiamate 11\.  
* Configurare l'ORM per non restituire l'intera riga se non necessaria (update/insert) 11\.  
* Rimuovere tabelle non necessarie dai backup manuali tramite Supavisor 11\.

