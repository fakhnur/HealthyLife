import { User } from '../models/User.js';
import { Content } from '../models/Content.js';
import { Activity } from '../models/Activity.js';
import { DailyMetric } from '../models/DailyMetric.js';
import { dayKey, addDays } from '../utils/date.js';
import { Favorite } from '../models/Favorite.js';

export const initialContents = [
  {
    title: 'Tips Pola Makan Seimbang Hari Ini',
    subtitle: 'Makan bergizi tanpa ribet untuk energi optimal sepanjang hari',
    category: 'Nutrisi',
    type: 'article',
    author: {
      name: 'Dian Pratiwi, S.Gz.',
      role: 'Ahli gizi klinis & Konsultan Nutrisi',
      bio: 'Membantu ratusan keluarga mencapai pola makan bernutrisi seimbang dan berkelanjutan tanpa diet ekstrem.',
      avatar: '',
    },
    readTime: '3 mnt baca',
    heroImage: '/figma/meal-hero.png',
    excerpt: 'Makan seimbang tak harus rumit. Mulai dari isi piring yang beragam dan porsi sesuai kebutuhan harianmu.',
    body: `Makan seimbang merupakan kunci utama menjaga daya tahan tubuh, kestabilan energi, dan kesehatan jangka panjang. Banyak orang beranggapan bahwa pola makan sehat itu sulit dan mahal, padahal prinsip dasarnya sangat sederhana: variasi gizi seimbang dan porsi yang tepat.

Dengan membagi piring makan menjadi komponen serat, karbohidrat kompleks, serta protein berkualitas, tubuh akan mendapatkan nutrisi makro dan mikro yang cukup tanpa membebani pencernaan.`,
    steps: [
      {
        title: 'Perbanyak warna.',
        description: 'Isi sekitar setengah piring dengan sayur dan buah untuk serat, antioksidan, dan aneka vitamin alami.',
      },
      {
        title: 'Lengkapi sisanya.',
        description: 'Pilih nasi merah, jagung, atau umbi sebagai karbohidrat kompleks, serta ikan, telur, tahu, atau tempe untuk protein.',
      },
    ],
    quote: '“Bukan soal makan sempurna, tetapi kebiasaan baik yang bisa kamu ulangi setiap hari.”',
    advice: 'Minum air secara teratur dan batasi minuman manis. Sesuaikan porsi dengan rasa lapar dan intensitas aktivitas fisik harianmu.',
    tags: ['Nutrisi', 'Pola Makan', 'Diet Seimbang', 'Hidup Sehat'],
    isFeatured: true,
  },
  {
    title: 'Gerak Ringan, Energi Seharian',
    subtitle: 'Latihan fleksibilitas & kardio ringan untuk memulai pagi penuh semangat',
    category: 'Olahraga',
    type: 'video',
    author: {
      name: 'Coach Rani Wijaya',
      role: 'Pelatih Kebugaran Fungsional',
      bio: 'Pelatih kebugaran fungsional bersertifikat dengan fokus latihan ramah pemula dan mobilitas aktif harian.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
    readTime: '12:30',
    videoDuration: '12:30',
    videoUrl: 'https://www.youtube.com/watch?v=gC_L9qAHVJ8',
    heroImage: '/figma/workout.png',
    excerpt: 'Bersama Coach Rani · Cocok untuk pemula tanpa peralatan khusus untuk memacu metabolisme pagi.',
    body: `Gerak ringan di pagi hari terbukti melancarkan sirkulasi oksigen ke otak, memicu pelepasan hormon endorfin, dan menghilangkan kekakuan otot akibat posisi tidur semalaman. Anda tidak memerlukan beban atau peralatan gym rumit, cukup luangkan waktu 12 menit di atas matras.`,
    steps: [
      {
        title: 'Pemanasan Sendi (2 Menit)',
        description: 'Putaran bahu perlahan, peregangan leher, dan putaran pinggul untuk mempersiapkan persendian.',
      },
      {
        title: 'Gerakan Dinamis (8 Menit)',
        description: 'Langkah kaki di tempat, squat santai tanpa beban, butt-kicks ringan, dan torso twists.',
      },
      {
        title: 'Peregangan Akhir (2 Menit)',
        description: 'Tarik napas dalam dari diafragma, rentangkan kedua lengan ke atas, dan bungkukkan badan perlahan.',
      },
    ],
    quote: '“Bergeraklah karena kamu mencintai tubuhmu, bukan karena ingin menghukumnya.”',
    advice: 'Kenakan pakaian longgar dan sepatu atau kaos kaki antiselip saat melakukan sesi latihan.',
    tags: ['Olahraga', 'Pagi', 'Pemula', 'Energi'],
    isFeatured: true,
  },
  {
    title: 'Latihan Kardio 15 Menit di Rumah',
    subtitle: 'Keringat deras tanpa alat untuk bakar kalori dan jantung sehat',
    category: 'Olahraga',
    type: 'video',
    author: {
      name: 'Coach Rian Pratama',
      role: 'Pelatih Kebugaran Bersertifikat',
      bio: 'Spesialis kardio & latihan beban tubuh tanpa alat untuk membakar kalori dan membentuk stamina prima.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    readTime: '15:00',
    videoDuration: '15:00',
    videoUrl: 'https://www.youtube.com/watch?v=ml6cT4AZdqI',
    heroImage: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop&q=80',
    excerpt: 'Panduan kardio intensitas sedang tanpa peralatan khusus untuk membakar kalori dan meningkatkan stamina.',
    body: `Latihan kardio di rumah sangat efektif bagi Anda yang memiliki jadwal padat namun tetap ingin menjaga kebugaran jantung dan membakar lemak. Rutinitas 15 menit ini menggabungkan gerakan fungsional interval dengan waktu istirahat terukur.`,
    steps: [
      {
        title: 'Pemanasan Dinamis (3 Menit)',
        description: 'Lakukan arm circles, leg swings, dan light jumping jacks untuk menaikkan suhu tubuh.',
      },
      {
        title: 'Interval Sirkuit Utama (9 Menit)',
        description: '3 putaran: 40 detik High Knees, 20 detik istirahat; 40 detik Squats, 20 detik istirahat; 40 detik Mountain Climbers.',
      },
      {
        title: 'Pendinginan & Relaksasi (3 Menit)',
        description: 'Peregangan hamstring, quad stretch, child pose, dan atur pernapasan dalam.',
      },
    ],
    quote: '“Konsistensi 15 menit setiap hari jauh lebih baik daripada 2 jam latihan yang hanya dilakukan sebulan sekali.”',
    advice: 'Gunakan alas matras agar sendi lutut tidak terbentur lantai keras. Selalu sediakan air minum di dekat Anda.',
    tags: ['Olahraga', 'Kardio', 'Latihan Rumah', 'Bakar Kalori'],
    isFeatured: false,
  },
  {
    title: 'Menu Sarapan Berenergi Tinggi Tanpa Gula Berlebih',
    subtitle: 'Resep praktis anti lemas untuk memulai pagi yang produktif',
    category: 'Nutrisi',
    type: 'article',
    author: {
      name: 'Dian Pratiwi, S.Gz.',
      role: 'Ahli gizi klinis & Konsultan Nutrisi',
      bio: 'Membantu ratusan keluarga mencapai pola makan bernutrisi seimbang dan berkelanjutan tanpa diet ekstrem.',
      avatar: '',
    },
    readTime: '4 mnt baca',
    heroImage: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
    excerpt: 'Kombinasi oatmeal hangat, telur rebus, dan biji chia untuk pelepasan energi lambat tanpa lonjakan gula darah.',
    body: `Sarapan tinggi gula olahan seperti kue manis atau teh manis kemasan kerap memicu lonjakan insulin yang disusul penurunan drastis energi (sugar crash). Pilihlah menu sarapan kaya protein dan lemak baik untuk energi stabil hingga siang hari.`,
    steps: [
      {
        title: 'Oatmeal & Biji Chia',
        description: 'Seduh rolled oat dengan susu rendah lemak atau susu kedelai, taburi sedikit kayu manis dan buah pisang segar.',
      },
      {
        title: 'Sumber Protein Bersih',
        description: 'Tambahkan 1–2 butir telur rebus atau Greek yogurt tawar untuk asupan asam amino pembangun otot.',
      },
    ],
    quote: '“Sarapan bergizi memberi sinyal pada metabolisme bahwa tubuh siap beraktivitas penuh.”',
    advice: 'Hindari sereal sarapan kemasan yang mengandung pemanis buatan tinggi.',
    tags: ['Nutrisi', 'Sarapan', 'Resep Sehat', 'Energi'],
    isFeatured: false,
  },
  {
    title: 'Superfood Lokal Indonesia yang Kaya Nutrisi & Antioksidan',
    subtitle: 'Mengenal khasiat daun kelor, tempe, ubi ungu, dan kunyit untuk imunitas tubuh',
    category: 'Nutrisi',
    type: 'article',
    author: {
      name: 'Dian Pratiwi, S.Gz.',
      role: 'Ahli gizi klinis & Konsultan Nutrisi',
      bio: 'Membantu ratusan keluarga mencapai pola makan bernutrisi seimbang dan berkelanjutan tanpa diet ekstrem.',
      avatar: '',
    },
    readTime: '5 mnt baca',
    heroImage: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop&q=80',
    excerpt: 'Bahan pangan lokal Indonesia terbukti memiliki kandungan antioksidan dan nutrisi mikro yang setara superfood impor.',
    body: `Kita sering kali tergiur membeli superfood impor berharga mahal seperti acai berry atau kale, padahal pasar tradisional kita kaya akan bahan superfood berkhasiat tinggi. Daun kelor misalnya, memiliki kandungan kalsium dan vitamin C berkali lipat lebih tinggi dibanding sayuran biasa.`,
    steps: [
      {
        title: 'Tempe fermentasi alami',
        description: 'Kaya probiotik alami dan isoflavon yang menjaga kesehatan usus dan menurunkan kadar kolesterol jahat.',
      },
      {
        title: 'Daun kelor dan rimpang kunyit',
        description: 'Kurkumin pada kunyit dan flavonoid pada kelor berfungsi sebagai agen antiinflamasi alami terkuat.',
      },
    ],
    quote: '“Pangan lokal yang segar dan tidak banyak diproses adalah obat terbaik bagi tubuh manusia.”',
    advice: 'Konsumsi olahan tempe dengan cara dikukus, ditumis ringan, atau dibakar, bukan digoreng rendam minyak (deep fried).',
    tags: ['Nutrisi', 'Superfood', 'Pangan Lokal', 'Antioksidan'],
    isFeatured: false,
  },
  {
    title: 'Peregangan Pagi Hari untuk Fleksibilitas Sendi',
    subtitle: '10 menit yoga santai untuk hilangkan kaku dan pegal saat bangun tidur',
    category: 'Olahraga',
    type: 'video',
    author: {
      name: 'Coach Sarah Novita',
      role: 'Instruktur Yoga Bersertifikat',
      bio: 'Instruktur mobilitas & fleksibilitas berlisensi, berfokus pada pencegahan cedera dan relaksasi persendian.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
    readTime: '10:00',
    videoDuration: '10:00',
    videoUrl: 'https://www.youtube.com/watch?v=4pKly2JojMw',
    heroImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    excerpt: 'Rangkaian gerakan yoga santai 10 menit untuk melancarkan sirkulasi darah dan meregangkan otot kaku.',
    body: `Saat tidur berjam-jam, cairan sendi mengental dan otot mengalami kekakuan ringan. Rangkaian peregangan lembut di pagi hari mengalirkan oksigen segar ke seluruh jaringan tubuh dan membangkitkan suasana hati positif.`,
    steps: [
      {
        title: 'Cat-Cow Pose (2 Menit)',
        description: 'Tengkurap dengan posisi merangkak, lengkungkan dan tundukkan tulang punggung mengikuti tarikan napas.',
      },
      {
        title: 'Downward-Facing Dog (3 Menit)',
        description: 'Angkat pinggul ke atas membentuk segitiga untuk meregangkan otot paha belakang, betis, dan pundak.',
      },
      {
        title: 'Cobra Pose & Child Pose (5 Menit)',
        description: 'Buka rongga dada untuk memperdalam tarikan napas, lalu rilekskan punggung bawah pada posisi child pose.',
      },
    ],
    quote: '“Tubuh yang lentur mencerminkan pikiran yang tenang dan adaptif.”',
    advice: 'Bernapaslah dengan ritme perlahan melalui hidung. Jangan memaksakan peregangan hingga terasa sakit menusuk.',
    tags: ['Olahraga', 'Yoga', 'Peregangan', 'Fleksibilitas'],
    isFeatured: false,
  },
  {
    title: 'Latihan Penguatan Otot Inti (Core) Tanpa Beban',
    subtitle: 'Perkuat perut dan pinggang untuk postur tubuh tegak dan bebas nyeri punggung',
    category: 'Olahraga',
    type: 'video',
    author: {
      name: 'Coach Rian Pratama',
      role: 'Pelatih Kebugaran Bersertifikat',
      bio: 'Spesialis kardio & latihan beban tubuh tanpa alat untuk membakar kalori dan membentuk stamina prima.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    readTime: '14:20',
    videoDuration: '14:20',
    videoUrl: 'https://www.youtube.com/watch?v=dJlFmxiL11s',
    heroImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80',
    excerpt: 'Gerakan plank, dead bug, dan bird-dog untuk membangun kestabilan punggung bawah dan mengencangkan perut.',
    body: `Otot inti (core) bukan hanya six-pack di perut depan, melainkan sabuk pelindung tulang belakang yang mencakup otot perut dalam, pinggul, dan punggung bawah. Otot inti yang kuat mencegah cedera saat mengangkat beban harian dan memperbaiki postur bungkuk.`,
    steps: [
      {
        title: 'Plank Hold Standar (3 x 30 Detik)',
        description: 'Kunci otot perut dan bokong, jaga garis lurus dari tumit hingga kepala.',
      },
      {
        title: 'Dead Bug & Bird-Dog (3 Putaran)',
        description: 'Latihan koordinasi silang yang sangat ramah untuk penderita nyeri punggung bawah.',
      },
    ],
    quote: '“Kekuatan sejati sebuah bangunan bertumpu pada fondasi kokoh di bagian tengahnya.”',
    advice: 'Fokus pada teknik pernapasan perut, jangan menahan napas saat menahan posisi plank.',
    tags: ['Olahraga', 'Core', 'Kebugaran', 'Postur'],
    isFeatured: false,
  },
  {
    title: 'Hidrasi Optimal: Panduan Air Harian',
    subtitle: 'Berapa banyak air yang benar-benar dibutuhkan tubuhmu setiap hari?',
    category: 'Hidrasi',
    type: 'article',
    author: {
      name: 'dr. Farhan Alamsyah',
      role: 'Dokter Umum & Edukator Kesehatan',
      bio: 'Praktisi kesehatan komunitas & dokter umum dengan dedikasi pada edukasi hidrasi serta pencegahan penyakit metabolik.',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    },
    readTime: '4 mnt baca',
    heroImage: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&auto=format&fit=crop&q=80',
    excerpt: 'Ketahui cara menghitung kebutuhan cairan tubuh dan tanda dehidrasi ringan sebelum mengganggu fokusmu.',
    body: `Tubuh manusia terdiri dari sekitar 60% cairan. Dehidrasi bahkan sekecil 2% dapat menurunkan konsentrasi kognitif, memicu sakit kepala, dan menimbulkan rasa lelah palsu. Membiasakan minum segelas air saat bangun tidur adalah langkah awal yang luar biasa.`,
    steps: [
      {
        title: 'Hitung kebutuhan cairan tubuh',
        description: 'Rumus dasar: berat badan (kg) dikali 30-35 ml. Misalnya 60 kg x 35 ml = 2.100 ml (sekitar 8-9 gelas per hari).',
      },
      {
        title: 'Distribusi sepanjang hari',
        description: 'Minum 1 gelas saat bangun tidur, 1 gelas sebelum makan, dan minum berkala saat bekerja atau berolahraga.',
      },
    ],
    quote: '“Rasa haus sering kali disalahartikan sebagai rasa lapar. Minumlah air terlebih dahulu.”',
    advice: 'Warna urine kuning pucat transparan adalah indikator hidrasi ideal Anda hari ini.',
    tags: ['Hidrasi', 'Air Putih', 'Metabolisme', 'Fokus'],
    isFeatured: false,
  },
  {
    title: 'Panduan Tidur Berkualitas untuk Pemulihan Tubuh',
    subtitle: 'Bangun segar dan tingkatkan daya tahan tubuh secara alami',
    category: 'Pola Tidur',
    type: 'article',
    author: {
      name: 'dr. Maya Saraswati, Sp.KJ',
      role: 'Spesialis Kedokteran Jiwa & Tidur',
      bio: 'Dokter spesialis kedokteran jiwa & pakar ritme sirkadian tubuh, mendampingi pemulihan stres dan pola tidur lelap.',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    },
    readTime: '5 mnt baca',
    heroImage: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=800&auto=format&fit=crop&q=80',
    excerpt: 'Strategi praktis mengatur ritme sirkadian dan kebersihan tidur (sleep hygiene) agar tidur lebih pulas.',
    body: `Tidur bukan sekadar beristirahat, melainkan fase pemulihan seluler, pelepasan hormon pertumbuhan, serta konsolidasi memori di otak. Kurang tidur kronis terbukti meningkatkan risiko obesitas, diabetes, dan tekanan darah tinggi.`,
    steps: [
      {
        title: 'Jadwal tidur konsisten',
        description: 'Tidur dan bangun pada jam yang sama setiap hari, termasuk di akhir pekan, untuk mengunci ritme sirkadian.',
      },
      {
        title: 'Ciptakan zona bebas gadget',
        description: 'Hentikan paparan layar biru smartphone dan laptop minimal 45 menit sebelum berbaring di tempat tidur.',
      },
    ],
    quote: '“Tidur malam yang lelap adalah investasi kesehatan dengan imbal balik tertinggi.”',
    advice: 'Jaga suhu kamar tidur tetap sejuk (sekitar 20–22°C) dan redupkan lampu untuk memicu produksi melatonin alami.',
    tags: ['Pola Tidur', 'Sleep Hygiene', 'Pemulihan', 'Kesehatan Mental'],
    isFeatured: false,
  },
  {
    title: 'Strategi Manajemen Stres & Keseimbangan Hormonal',
    subtitle: 'Latihan pernapasan 4-7-8 dan teknik grounding untuk redakan kecemasan',
    category: 'Hidup Sehat',
    type: 'article',
    author: {
      name: 'dr. Maya Saraswati, Sp.KJ',
      role: 'Spesialis Kedokteran Jiwa & Tidur',
      bio: 'Dokter spesialis kedokteran jiwa & pakar ritme sirkadian tubuh, mendampingi pemulihan stres dan pola tidur lelap.',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    },
    readTime: '4 mnt baca',
    heroImage: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&auto=format&fit=crop&q=80',
    excerpt: 'Stres kronis memicu lonjakan hormon kortisol yang merusak kualitas tidur dan daya tahan tubuh. Redakan dengan teknik praktis ini.',
    body: `Saat menghadapi tekanan pekerjaan atau deadline, sistem saraf simpatik kita aktif dalam mode fight-or-flight. Dengan melatih teknik pernapasan teratur, saraf parasimpatik terpicu untuk menurunkan denyut jantung dan menenangkan pikiran seketika.`,
    steps: [
      {
        title: 'Metode Pernapasan 4-7-8',
        description: 'Tarik napas melalui hidung selama 4 detik, tahan napas selama 7 detik, dan buang napas perlahan melalui mulut selama 8 detik.',
      },
      {
        title: 'Jalan Kaki Tanpa Gadget (Digital Detox)',
        description: 'Luangkan 15 menit berjalan santai di luar ruangan tanpa mengecek notifikasi ponsel.',
      },
    ],
    quote: '“Ketenangan bukanlah ketiadaan badai, melainkan kedamaian di tengah badai itu sendiri.”',
    advice: 'Terapkan teknik pernapasan 4-7-8 minimal 4 putaran saat Anda mulai merasa kewalahan.',
    tags: ['Hidup Sehat', 'Manajemen Stres', 'Kesehatan Mental', 'Pernapasan'],
    isFeatured: false,
  },
];

const daysAgoAt = (days, hour, minute) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d;
};

export const seedDatabase = async () => {
  try {
    // Content: upsert by title so ids stay stable across restarts (favorites reference them).
    await Content.bulkWrite(
      initialContents.map((doc) => ({
        updateOne: { filter: { title: doc.title }, update: { $set: doc }, upsert: true },
      }))
    );
    const contents = await Content.find({ title: { $in: initialContents.map((c) => c.title) } });
    const byTitle = new Map(contents.map((c) => [c.title, c]));
    console.log(`[Seed] Content synced (${contents.length} items).`);

    // Demo data is created once; later boots must never wipe what the user recorded.
    let demoUser = await User.findOne({ email: 'budi@healthylife.com' });
    if (demoUser) {
      if (demoUser.name !== 'Budi Pratama') {
        demoUser.name = 'Budi Pratama';
        await demoUser.save();
      }
      return;
    }

    console.log('[Seed] Creating demo user: budi@healthylife.com / password123');
    demoUser = await User.create({
      name: 'Budi Pratama',
      email: 'budi@healthylife.com',
      password: 'password123',
      avatar: '/figma/budi-avatar.png',
    });

    const todayKey = dayKey();
    const activities = [
      { category: 'Olahraga', title: 'Jalan Pagi Santai', durationMinutes: 30, calories: 120, notes: 'Jalan santai di sekitar komplek rumah.', date: daysAgoAt(0, 6, 15) },
      { category: 'Olahraga', title: 'Latihan Kardio Ringan', durationMinutes: 20, calories: 95, notes: 'Pemanasan dan kardio sedang di pagi hari.', date: daysAgoAt(0, 7, 30) },
      { category: 'Nutrisi', title: 'Makan Siang Seimbang', durationMinutes: 0, calories: 480, notes: 'Nasi merah, dada ayam panggang, dan tumis brokoli.', date: daysAgoAt(0, 12, 15) },
      { category: 'Olahraga', title: 'Yoga Peregangan', durationMinutes: 25, calories: 80, notes: '', date: daysAgoAt(1, 17, 0) },
    ];
    await Activity.create(activities.map((a) => ({ ...a, user: demoUser._id })));

    // Daily metrics derived from the seeded activities so numbers always add up.
    const metricFor = (date, extras) => {
      const day = activities.filter((a) => dayKey(a.date) === date && a.category === 'Olahraga');
      return {
        user: demoUser._id,
        date,
        targetSteps: 10000,
        targetCalories: 500,
        targetWaterMl: 2000,
        caloriesBurned: day.reduce((n, a) => n + a.calories, 0),
        activeMinutes: day.reduce((n, a) => n + a.durationMinutes, 0),
        ...extras,
      };
    };
    await DailyMetric.create([
      metricFor(todayKey, { steps: 8750, waterMl: 1800 }),
      metricFor(addDays(todayKey, -1), { steps: 7800, waterMl: 1500 }),
    ]);

    const favoriteTitles = [
      'Tips Pola Makan Seimbang Hari Ini',
      'Gerak Ringan, Energi Seharian',
      'Latihan Kardio 15 Menit di Rumah',
    ];
    for (const title of favoriteTitles) {
      const item = byTitle.get(title);
      if (item) await Favorite.create({ user: demoUser._id, content: item._id });
    }

    console.log('[Seed] Demo user data created.');
  } catch (error) {
    console.error(`[Seed] Error during seeding: ${error.message}`);
  }
};
