// Testimonianze degli studenti per ogni corso
// Organizzate per codice corso (TAA, EEC, MASSAF)

export interface CourseTestimonial {
  id: string;
  name: string;
  title: string;
  date: string;
  excerpt: string;  // Versione breve per la card
  fullText: string; // Testo integrale
}

export const courseTestimonials: Record<string, CourseTestimonial[]> = {
  // Master in Editoria e Comunicazione
  'EEC': [
    {
      id: 'eec-1',
      name: 'Stefania Ianniello',
      title: 'Master in Editoria e Comunicazione, tra sogni ed opportunita\'',
      date: '15/04/2022',
      excerpt: 'Ben articolato il piano di studi, tra aula, sviluppo di progetti e visite; molto utili le masterclass. Ha fatto la differenza il modulo di personal branding e orientamento. Innform e\' stato attento alle nostre esigenze.',
      fullText: `Ben articolato il piano di studi, tra aula, sviluppo di progetti e visite; molto utili le masterclass. Ha fatto la differenza il modulo di personal branding e orientamento con una orientatrice qualificata Asnor, per la valorizzazione delle competenze e la scelta dello stage piu\' in linea con i nostri profili. Innform e\' stato attento alle nostre esigenze.

Quando mi viene chiesto come sia approdata al Master in Editoria e Comunicazione della Innform, rispondo per puro caso, per una di quelle assurde deviazioni che la vita subisce di tanto in tanto, mentre stai facendo altri programmi. Succede che un giorno qualcosa che non avevi mai completamente messo da parte bussi alla tua porta, e che tu rimanga sull'uscio per un bel po' prima di aprire, prima di accorgerti che non avresti poteva fare altrimenti. Nel mio caso si tratta della passione per il mondo della scrittura e della comunicazione.

Ho avuto la fortuna di lavorare in una classe di persone collaborative e motivate e di confrontarmi con docenti che sono prima di tutto professionisti del settore, i quali ci hanno guidati nella realizzazione pratica di progetti in ambito giornalistico ed editoriale, seguiti da un ente di formazione sempre attento alle nostre esigenze.

Il piano di studi e\' stato ben articolato tra formazione, project work e visite didattiche. Una parte delle ore di spese in aula e\' stata dedicata alle masterclass, che ho trovato molto utili perche\' ci hanno offerto uno spaccato delle professioni legate al mondo dell'editoria e della comunicazione.

A conclusione, posso dire che sono felice che la vita mi abbia presentato questa opportunita\'. Sto scoprendo che le professioni legate alla scrittura sono molteplici, e che scrivere per professione potrebbe essere piu\' che un sogno.`
    },
    {
      id: 'eec-2',
      name: 'Elvira Ciufo',
      title: 'Che meraviglia... lo stage che desideravo',
      date: '03/05/2022',
      excerpt: 'Con i miei colleghi ho viaggiato tra le pagine dell\'editoria e volato tra visite didattiche e fiere. Ed e\' stato proprio nella fiera di Roma "Piu\' libri piu\' liberi" che sono stata messa in contatto con "La Corte Editore" per uno stage a Torino.',
      fullText: `Con i miei colleghi ho viaggiato tra le pagine dell'editoria e volato tra visite didattiche e fiere. Ed e\' stato proprio in quella di Roma, "Piu\' libri piu\' liberi", che sono stata messa in contatto con "La Corte Editore", per uno stage a Torino. Non eravamo in veste di spettatori ma per effettuare incontri reali con le imprese.

Il master in Editoria e Comunicazione organizzato da Innform e\' capitato sulla mia strada al momento giusto. Non si e\' trattato solo di didattica, ma e\' stata una vera e propria avventura. Con i miei compagni di corso ho viaggiato tra le pagine dell'editoria e volato tra gite didattiche e fiere.

L'emozione iniziale e\' stata davvero unica: tutto questo per me, che da quando ho praticamente aperto gli occhi su questo mondo, vivo con il cuore affondato nei romanzi. Io e i miei compagni di master siamo partiti di mattino presto, (meta: la fiera), con un autobus fittato per l'occasione e siamo giunti a Roma colmi di energie e aspettative.

Un grazie sincero va in particolare alla coordinatrice didattica, Oriana, mia ancora e guida in questo mare cosi\' luccicante e caldo ma spesso tanto mosso e travagliato, e in generale a Innform per aver reso possibile l'inizio di quest'avventura.`
    },
    {
      id: 'eec-3',
      name: 'Tiziana Figliuolo',
      title: 'Un master bellissimo... un\'avventura indimenticabile',
      date: '24/02/2017',
      excerpt: 'Il master in Editoria e Comunicazione: Master bellissimo, perfetta prosecuzione del mio percorso di studi. Ho fatto cose nuove, con piccole e grandi soddisfazioni e con incredibili possibilita\'. Come quella di realizzare un inserto digitale per Il Mattino di Puglia e Basilicata.',
      fullText: `Il master in Editoria e Comunicazione: Master bellissimo, perfetta prosecuzione del mio percorso di studi. Ho fatto cose nuove, con piccole e grandi soddisfazioni e con incredibili possibilita\'. Come quella di realizzare un inserto digitale per Il Mattino di Puglia e Basilicata, sotto la guida sapiente di Fabio Amendolara, giornalista di spicco, e di Manuela Stefanelli, grafica affermata.

La voglia di imparare a comunicare per conoscere gli altri, mi e\' sempre rimasta dentro, insieme al desiderio di lavorare nell'ambito della comunicazione. Cosi\', quando a distanza di molti anni, ne ho avuto la possibilita\', l'ho fatto: ho ripreso gli studi. Fra impegni, contrattempi e difficolta\' personali, c'e\' voluto molto tempo, ma alla fine ci sono riuscita. Alla non piu\' tenera eta\' di 49 anni mi sono laureata!

Ho imparato cose nuove. Ho fatto cose nuove. Con alti e bassi. Con delle piccole e grandi soddisfazioni personali. E, soprattutto, con incredibili possibilita\'.

Ringrazio la Innform, in particolare Oriana Marino, che mi ha dato la possibilita\' di partecipare al master, e Francesco Aliastro, che me ne ha fatto scoprire l'esistenza, i docenti tutti, per quello che mi hanno insegnato, non solo didatticamente.`
    },
    {
      id: 'eec-4',
      name: 'Nicola Patrissi',
      title: 'Master in Editoria e Comunicazione: un percorso all\'altezza delle mie aspettative',
      date: '28/04/2022',
      excerpt: 'Il master, caratterizzato dalla perfetta commistione tra le varie, eccezionali competenze dei docenti. La ciliegina sulla torta e\' stata la creazione di gruppo del romanzo giallo "Non sara\' un\'avventura". Una prova complicata, stimolante e gratificante.',
      fullText: `Il master, caratterizzato dalla perfetta commistione tra le varie, eccezionali competenze dei docenti. Dal docente Fabio Amendolara ho appreso preziose nozioni sul mestiere del giornalista. La ciliegina sulla torta e\' stata la creazione di gruppo del romanzo giallo "Non sara\' un'avventura". Un romanzo, nato da una pazza idea del docente Gianfranco Blasi: una prova complicata, stimolante e gratificante.

"Non e\' tanto chi sei quanto quello che fai che ti qualifica": con questa frase presa in prestito da Batman Begins, film del 2005 diretto da Christopher Nolan, credo possa riassumersi il mio modo di vedere la vita o, perlomeno, alcuni suoi aspetti.

Un percorso che si e\' rivelato subito all'altezza delle mie aspettative. Io, giornalista pubblicista con la passione per il calcio e lo sport in generale, ho potuto immergermi, fin dai primi momenti, in una realta\' dinamica e stimolante caratterizzata dalla perfetta commistione tra le varie, eccezionali competenze di tutti i docenti incontrati lungo la strada.

Un doveroso ringraziamento lo devo anche agli altri docenti incontrati durante il percorso, non dimenticando, chiaramente, l'ente di formazione Innform il quale, e\' sempre stato professionale, disponibile e attento a ogni nostra esigenza.`
    },
    {
      id: 'eec-5',
      name: 'Michela Di Melfi',
      title: 'Ai futuri allievi dico: questo e\' un viaggio tutto da vivere!',
      date: '16/05/2022',
      excerpt: 'Questo master apre realmente le porte dell\'editoria e della comunicazione, facendoti toccare con mano la realta\' di questi due mondi. L\'approccio pratico, esercitazioni e project work ti spingono a metterti alla prova.',
      fullText: `Questo master apre realmente le porte dell'editoria e della comunicazione, facendoti toccare con mano la realta\' di questi due mondi. L'approccio pratico, esercitazioni e project work ti spingono a metterti alla prova e misurarti con le tue capacita\'. Ringrazio Innform per la professionalita\' e la coordinatrice Oriana, per averci guidato in questo percorso, venendo incontro alle nostre esigenze.

Il mio primo approccio con il Master di Editoria e Comunicazione e\' stato esattamente nel 2020. Appena laureata, ho cercato e voluto fortemente questo master, e ho aspettato pazientemente il suo inizio, nonostante i mille intralci che la pandemia ci ha portato.

Il primo modulo e\' stato quello di orientamento con la docente Stefania Clemente, davvero efficace e importantissimo. Da subito questo approccio ti porta a interrogarti sulle tue ambizioni e i tuoi reali interessi.

Mi sento di consigliare questo master sia a chi ha una forte propensione per l'editoria e la comunicazione, e vuole approfondire questi due mondi per capire in che direzione andare, ma anche chi avendo intrapreso una strada diversa, e\' comunque incuriosito da questa dimensione e vuole capirne di piu\'. Ai futuri allievi del master dico, che questo e\' un viaggio tutto da vivere, e che le parole non riescono a esprimere a pieno tutte quelle sfumature che solo l'esperienza concreta vi potra\' donare.`
    }
  ],

  // Master Tecnico Esperto in Analisi Alimentari e Ambientali
  'TAA': [
    {
      id: 'taa-1',
      name: 'Maria Salinardi',
      title: 'Felice della scelta fatta e che rifarei ad occhi chiusi',
      date: '04/05/2022',
      excerpt: 'Gli argomenti come Certificazioni ISO, Sicurezza Alimentare, Gestione Qualita\' e Sviluppo di un Manuale HACCP, proprio quelli richiesti nei tanti annunci a cui mi ero candidata. Una grande occasione per ampliare il mio bagaglio personale.',
      fullText: `"Forse e\' il caso che mi iscriva alla Magistrale, chi vuoi che mi assuma con una semplice Triennale", "Sono gia\' fuori eta\' adesso per il lavoro, figuriamoci tra due anni, meglio lasciar perdere lo studio ed iniziare a lavorare quanto prima". Questi, tra i pensieri ricorrenti, quelli che maggiormente mi attanagliavano la mente.

In una delle mie solite ricerche, oserei dire quotidiane, leggo di questo "MASTER TECNICO ESPERTO ANALISI ALIMENTARI E AMBIENTALI". Subito catturano la mia attenzione argomenti come Certificazioni ISO, Sicurezza Alimentare, Gestione Qualita\' e Sviluppo di un Manuale HACCP, proprio quelli richiesti nei tanti annunci a cui mi ero candidata.

Gli argomenti affrontati in questi mesi sono stati tanti, alcuni a me gia\' conosciuti, dal punto di vista teorico, che ho avuto modo di approfondire e di trattare sotto un aspetto completamente diverso, di natura professionale, ed altri, del tutto nuovi, che mai avrei pensato potessero interessarmi e che, invece, mi hanno conquistata ed appassionata sempre di piu\'.

Il Regista di tutto cio\', colui che ci ha seguiti sin dalle prime chiacchierate informative fino alla fine del Tirocinio, e\' Francesco, uno degli organizzatori del Master che, tra docenti, lezioni, 13 ragazze + 1 ragazzo, aziende, uscite, i suoi immancabili cornetti a meta\' mattina e chi piu\' ne ha piu\' ne metta, se l'e\' cavata davvero bene. Felice della scelta fatta e che rifarei ad occhi chiusi.`
    },
    {
      id: 'taa-2',
      name: 'Rosa Botta',
      title: 'Un Master Completo',
      date: '05/05/2022',
      excerpt: 'Sono laureata in Chimica, ho preferito seguire il master per potere ampliare le conoscenze in questo settore. Ho avuto modo di conoscere docenti, professionisti che hanno presentato e svelato i segreti del loro lavoro con una passione tale da trasmettertela.',
      fullText: `Sono laureata in Chimica, anziche\' di continuare con gli studi, ho preferito seguire il master in Tecnico Esperto in Analisi Ambientali e Alimentari per potere ampliare le conoscenze in questo settore e per poter inserirmi nello stesso, restando nella mia regione. Ora che ho terminato il percorso sono felice e commossa allo stesso tempo.

Ho avuto modo di conoscere docenti, professionisti che hanno presentato, illustrato e anche svelato i segreti del loro lavoro con una passione tale da trasmettertela. Per non parlare dei compagni di corso, persone che, venivano da percorsi diversi e che come me hanno mille progetti e sogni, persone brillanti e gioiose.

Il master e\' stato oltre che un impegno, serio e conciso, anche un piacere. Mi ha dato quella marcia in piu\' che oggi mi ha permesso di relazionarmi con professionisti nell'ambito delle analisi e monitoraggio ambientale e alimentare.

Sono soddisfatta, entusiasta e grata. Grazie in particolar modo a Francesco che dall'inizio alla fine e\' stato da aiuto e sostegno ad ognuno di noi anche viziandoci durante il corso. Francesco e\' stato un faro, una persona che, a prescindere, e\' bello incontrare nella vita. Ad maiora semper a tutti!!`
    },
    {
      id: 'taa-3',
      name: 'Giovanni Lavaia',
      title: 'Quello che inizialmente era uno stage si e\' trasformato in contratto di lavoro',
      date: '26/06/2022',
      excerpt: 'Il master, mi ha dato la possibilita\' di creare un rapporto con i docenti e professionisti del settore. La possibilita\' di avere un dialogo continuo mi ha aiutato a fare la scelta giusta per lo stage formativo.',
      fullText: `Il master, mi ha dato la possibilita\' di creare un rapporto con i docenti e professionisti del settore, i quali hanno arricchito il mio bagaglio culturale con passione per la loro professione. La possibilita\' di avere un dialogo continuo mi ha aiutato a fare la scelta giusta per lo stage formativo.

Sono un biologo nutrizionista appassionato di sicurezza alimentare e ambientale, motivo per cui ho deciso di iscrivermi a questo corso di alta formazione. I miei tanti dubbi iniziali sono stati subito chiariti dal coordinatore del corso Francesco. Persona gentile, precisa e sempre disponibile.

In merito allo stage posso dire, che dopo aver valutato diverse opportunita\', grazie ai consigli del tutor, mi sono ritrovato a svolgere il ruolo di "controllo qualita\'" all'interno di una nota azienda alimentare.

Quello che inizialmente era uno stage si e\' trasformato in un contratto di lavoro, quindi una possibilita\' per la mia carriera e per la mia crescita personale. Il mio consiglio ai futuri studenti, e\' quello di iscriversi al master per sfruttare le opportunita\' che il percorso mette a disposizione.`
    },
    {
      id: 'taa-4',
      name: 'Barbara Cecchi',
      title: 'Il percorso giusto da intraprendere subito dopo la laurea',
      date: '30/06/2022',
      excerpt: 'Il "Master in Tecnico Esperto in Analisi Alimentari ed Ambientali" e\' stato il percorso giusto da intraprendere subito dopo la laurea. Le mie conoscenze astratte della chimica hanno avuto finalmente riscontro pratico.',
      fullText: `Il "Master in Tecnico Esperto in Analisi Alimentari ed Ambientali" e\' stato il percorso giusto da intraprendere subito dopo la laurea in scienze forestali e ambientali. Le mie conoscenze astratte della chimica hanno avuto finalmente riscontro pratico grazie ad attivita\' di laboratorio dedicate; le lezioni frontali non sono mai state statiche e nozionistiche; i docenti sono stati fonte continua di stimoli e suggerimenti professionali.

Lo stage finale in azienda poi... E\' la ciliegina sulla torta! Mi ha dato la possibilita\' di interfacciarmi con il mondo del lavoro, di creare rapporti professionali e di acquisire competenze che vanno ad arricchire il mio curriculum.

Sono in grado, finalmente, di potermi confrontare con professionisti del settore chimico e di candidarmi per professioni a questo affini.

In tutto questo, sono stata seguita dal primo all'ultimo giorno dal Coordinatore Francesco, figura paziente e disponibile, nonche\' indispensabile per la riuscita ed il successo di questo percorso!`
    }
  ],

  // Master Safety Manager (Sicurezza sul Lavoro)
  'MASSAF': [
    {
      id: 'massaf-1',
      name: 'Marco Cardilli',
      title: 'Essere un Esperto nella gestione dei sistemi di sicurezza',
      date: '16/05/2022',
      excerpt: 'La cosa che mi ha incuriosito di questo master e\' il taglio pratico con tante visite in azienda e numerose ore di tirocinio aziendale. Dopo una prima parte d\'aula ci siamo confrontati con la realta\' locale.',
      fullText: `La cosa che mi ha incuriosito di questo master e\' il taglio pratico con tante visite in azienda e numerose ore di tirocinio aziendale. E' stata un'esperienza che consiglio di fare. Dopo una prima parte d'aula ci siamo confrontati con la realta\' locale, ascoltando le esperienze dei lavoratori e dei datori di lavoro relativamente alla sicurezza aziendale e ambientale.

Mi chiamo Marco Cardilli e sono laureato in ingegneria ambientale nel ramo della Tutela Ambientale e Controllo dell'Inquinamento (T.A.C.I.). Ho saputo del Master in Safety Management attraverso una pubblicita\' in internet poiche\' ero alla ricerca di un corso di perfezionamento post-laurea.

Il Safety Manager e\' un tecnico che si occupa della salute e sicurezza dei lavoratori e dell'ambiente di lavoro. Questi aspetti sono spesso lasciati all'improvvisazione e vengono sacrificati in nome della produttivita\'.

Globalmente valuto questa esperienza molto positiva e sicuramente mi sento di consigliarla per chi ha voglia di mettersi in gioco e iniziare ad entrare nel mondo della sicurezza aziendale. Tra i punti forti mi sento di evidenziare le numerose visite tecniche che abbiamo potuto fare durante la formazione e che mi hanno permesso di visitare su tutte, l'acciaieria SiderPotenza un'esperienza molto importante e formativa.`
    },
    {
      id: 'massaf-2',
      name: 'Giuseppe Canio Matteo',
      title: 'Un\'opportunita\' per chi ha passione per la Sicurezza sui luoghi di lavoro',
      date: '22/02/2023',
      excerpt: 'Al termine del Percorso del Master sono stato ricontattato dall\'azienda presso la quale avevo svolto lo stage formativo, mi e\' stato proposto di proseguire il percorso come Addetto al Servizio di Prevenzione e Protezione.',
      fullText: `Al termine del Percorso del Master sono stato ricontattato dall'azienda presso la quale avevo svolto lo stage formativo, mi e\' stato proposto di proseguire il percorso che avevo intrapreso durante lo stage coadiuvando l'operato del Responsabile del Servizio di Prevenzione e Protezione in qualita\' di Addetto al Servizio di Prevenzione e Protezione, ottenendo autonomia lavorativa dal primo istante.

Ho scoperto nel 2019 il Master in Safety Manager attraverso il passaparola tra i colleghi Tecnici della Prevenzione una volta laureati. Essendo la prima edizione del Master in Italia rappresentava sicuramente una opportunita\' da non perdere in quanto una specializzazione del genere sulla sicurezza del lavoro poteva essere un trampolino di lancio per valorizzare nel mondo del lavoro le competenze acquisite durante gli anni di studio precedenti.

Il Safety Manager puo\' intervenire in maniera incisiva in quanto presenta un approccio a 360° a tutte le dinamiche legate alla sicurezza sul lavoro. Risulta essere formato in termini di Sicurezza sui Luoghi di Lavoro e, in virtu\' della certificazione ISO 45001, ha un approccio sistematico ai singoli problemi.

Spazio per il Safety Manager ce n'e\' in abbondanza in questo momento storico e potrebbe essere un'opportunita\' per coloro che condividono la passione per la Sicurezza sui luoghi di lavoro.`
    },
    {
      id: 'massaf-3',
      name: 'Donato Galasso',
      title: 'Dopo il master subito il lavoro!',
      date: '23/02/2023',
      excerpt: 'Grazie ad Innform, alle certificazioni che il master mi ha rilasciato e ai contatti che Innform ha con Aziende su tutto il territorio nazionale oggi lavoro presso RINA Services SpA. Il master Safety Manager e\' davvero bello e ben fatto.',
      fullText: `Grazie ad Innform, alle certificazioni che il master mi ha rilasciato e ai contatti che Innform ha con Aziende su tutto il territorio nazionale oggi lavoro presso RINA Services SpA. Il master Safety Manager e\' davvero bello e ben fatto. Lo staff di Innform e\' sempre stato disponibile e professionale durante tutto il percorso formativo.`
    }
  ]
};

// Mappa slug -> codice per supportare entrambi i formati
const slugToCodeMap: Record<string, string> = {
  'editoria-e-comunicazione': 'EEC',
  'master-editoria-comunicazione': 'EEC',
  'tecnico-analisi-alimentari': 'TAA',
  'tecnico-esperto-in-analisi-alimentari-e-ambientali': 'TAA',
  'master-safety-manager': 'MASSAF',
  'safety-manager': 'MASSAF',
  'safety-manager-esperto-in-sicurezza-e-ambiente': 'MASSAF',
};

// Funzione helper per ottenere le testimonianze di un corso
export function getTestimonialsForCourse(courseCode: string): CourseTestimonial[] {
  // Prova prima con il codice diretto
  if (courseTestimonials[courseCode]) {
    return courseTestimonials[courseCode];
  }
  // Altrimenti cerca tramite slug
  const mappedCode = slugToCodeMap[courseCode.toLowerCase()];
  if (mappedCode && courseTestimonials[mappedCode]) {
    return courseTestimonials[mappedCode];
  }
  return [];
}

// Funzione per ottenere un numero limitato di testimonianze (per la preview)
export function getTestimonialsPreview(courseCode: string, limit: number = 3): CourseTestimonial[] {
  const testimonials = getTestimonialsForCourse(courseCode);
  return testimonials.slice(0, limit);
}
