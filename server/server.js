require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const fs = require("fs");
const csv = require("csv-parser");
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

// Firebase Admin SDK'yı başlat
const serviceAccount = JSON.parse(fs.readFileSync('./firebasekey.json', 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fitness-62a19.firebaseio.com', // Firebase projesine uygun URL
});
const db = admin.firestore();

// Midllewares
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({ origin: "*" })); // Gerekirse belirli domainler eklenebilir.

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chat GPT Gym program endpoint
app.post("/api/chat/gym", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).send({ error: "Bir mesaj gerekli!" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `
        Sen bir fitness koçusun. Kullanıcının belirttiği bilgiler doğrultusunda bir antrenman programı oluştur. Program şu kurallara göre hazırlanmalı:
        
        ### Genel Kurallar:
        - Günde minimum 7, maksimum 10 hareket olmalı.
        - Günlük hedef kas grupları net bir şekilde belirtilmeli.
        - Program gün sayısına ve cinsiyete göre farklılık göstermeli.
        
        ### Kadınlar İçin:
        - Kalça ve bacak günlerinde karın hareketi eklenmeli.
        - Kadınlar için olmaması gereken hareketler:
          - Bench Press
          - Incline Bench Press
          - Push-Up
          - Chest Fly
          - Dumbbell Pullover
        
        **Kadınlar için hedefleme şeması (gün sayısı = x):**
        - **y(2):**
          1. gün: üst vücut
          2. gün: kalça ve bacak
        - **y(3):**
          1. gün: üst vücut
          2. gün: kalça
          3. gün: bacak
        - **y(4):**
          1. gün: üst vücut
          2. gün: kalça
          3. gün: bacak
          4. gün: kalça ve bacak
        - **y(5):**
          1. gün: üst vücut
          2. gün: kalça
          3. gün: bacak
          4. gün: kalça
          5. gün: bacak
        - **y(6):**
          1. gün: üst vücut
          2. gün: kalça
          3. gün: bacak
          4. gün: üst vücut
          5. gün: kalça
          6. gün: bacak
        
        ### Erkekler İçin:
        - Alt ve üst vücut günleri hedeflenmeli.
        - Hedef kas grupları:
          - Göğüs + arka kol
          - Sırt + ön kol
          - Omuz + bacak + karın
        
        **Erkekler için hedefleme şeması (gün sayısı = x):**
        - **y(2):**
          1. gün: üst vücut
          2. gün: alt vücut
        - **y(3):**
          1. gün: göğüs + arka kol
          2. gün: sırt + ön kol
          3. gün: omuz + bacak + karın
        - **y(4):**
          1. gün: göğüs + arka kol
          2. gün: sırt + ön kol
          3. gün: omuz + bacak + karın
          4. gün: göğüs + sırt
        - **y(5):**
          1. gün: göğüs + arka kol
          2. gün: sırt + ön kol
          3. gün: omuz + bacak + karın
          4. gün: göğüs + arka kol
          5. gün: sırt + ön kol
        - **y(6):**
          1. gün: göğüs + arka kol
          2. gün: sırt + ön kol
          3. gün: omuz + bacak + karın
          4. gün: göğüs + arka kol
          5. gün: sırt + ön kol
          6. gün: omuz + bacak + karın
        
        Yanıtını yalnızca şu formatta ver:
        
        {
            "program": [
                {
                    "gün": 1,
                    "hareketler": [
                        { "adı": "EGZERSIZ_ADI", "set": SET_SAYISI, "tekrar": TEKRAR_SAYISI }
                    ]
                },
                ...
            ]
        }
        \`\`\`
        
        Yanıtında başka açıklama ekleme ve belirttiğim formatı koru.`
        },
        { role: "user", content: message }
      ]
    });

    const reply = response.choices[0].message.content;

    // JSON doğrulama
    try {
      const parsedReply = JSON.parse(reply);
      res.status(200).send({ reply: parsedReply });
    } catch (jsonError) {
      console.log(reply);
      console.error("JSON Parse Error:", jsonError);
      res.status(500).send({ error: "Yanıt JSON formatında değil. Lütfen tekrar deneyin." });
    }
  } catch (error) {
    console.error("OpenAI API Error:", error.response ? error.response.data : error.message);
    res.status(500).send({ error: error.response ? error.response.data : error.message });
  }
});

// Chat GPT Diet program endpoint
app.post("/api/chat/diet", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    console.log(req.body);
    return res.status(400).send({ error: "Bir mesaj gerekli!" });
  }
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system", content: `
    Sen bir diyetisyen ve beslenme uzmanısın. Kullanıcının verdiği bilgilere dayanarak, ona uygun bir diyet planı oluştur. Şunlara dikkat et:
    1. Program kesinlikle 7 günlük olmalı ve her gün 3 ana öğün içermelidir.
    2. Kullanıcının vücut kitle indeksi (VKİ):
       - 23'ün altındaysa: Kilo alma hedefi,
       - 23-30 arası: Kilo koruma hedefi,
       - 30'un üstündeyse: Kilo verme hedefi.
    3. Kalori hesaplaması:
       - Kadınlar: 650 + (9.6 x kg) + (1.8 x cm) - (4.7 x yaş).
       - Erkekler: 66 + (13.7 x kg) + (5 x cm) - (6.8 x yaş).
    4. Kullanıcının günlük makro ihtiyacı (kilogram başına):
       - Protein: 1.5-2 g,
       - Yağ: Maks. 0.5 g,
       - Karbonhidrat: Geriye kalan kalori miktarı.
    5. Yemek önerilerinde şunlara dikkat et:
       - Her öğünde, kişiye uygun ve dengeli yemekler öner.
       - Eğer yiyecek taneli bir gıda (örneğin, muz, yumurta gibi) içeriyorsa, miktarını gram yerine adet olarak belirt.
       - Yemeklerin adı model tarafından oluşturulmalı, örnek yemek adı verilmemelidir.
       - Yemekler kullanıcının makro hedeflerine ve günlük kalori ihtiyacına uygun olmalıdır.
       - Yemek isimleri ve içerikler, diyetin amacına (kilo alma, verme veya koruma) uygun olmalıdır.
    6. Yanıt kesinlikle sadece şu formatta olmalıdır (açıklama yapma, hesaplama detaylarını gösterme, sadece JSON formatı üret):
    {
      \"program\": [
        {
          \"gün\": 1,
          \"öğünler\": [
            {
              \"adı\": \"KAHVALTI\",
              \"kalori\": KAHVALTI_KALORİ,
              \"protein\": KAHVALTI_PROTEİN,
              \"yağ\": KAHVALTI_YAĞ,
              \"karbonhidrat\": KAHVALTI_KARBONHİDRAT,
              \"yemek\": \"KAHVALTI_YEMEĞİ\"
            },
            {
              \"adı\": \"ÖĞLE YEMEĞİ\",
              \"kalori\": OGLE_KALORİ,
              \"protein\": OGLE_PROTEİN,
              \"yağ\": OGLE_YAĞ,
              \"karbonhidrat\": OGLE_KARBONHİDRAT,
              \"yemek\": \"OGLE_YEMEĞİ\"
            },
            {
              \"adı\": \"AKŞAM YEMEĞİ\",
              \"kalori\": AKSAM_KALORİ,
              \"protein\": AKSAM_PROTEİN,
              \"yağ\": AKSAM_YAĞ,
              \"karbonhidrat\": AKSAM_KARBONHİDRAT,
              \"yemek\": \"AKSAM_YEMEĞİ\"
            }
          ]
        },
        // Geri kalan günler aynı yapıda devam eder...
      ]
    }
}`},
        { role: "user", content: message },
      ],
    });

    const reply = response.choices[0].message.content;

    // JSON doğrulama
    try {
      const parsedReply = JSON.parse(reply);
      res.status(200).send({ reply: parsedReply });
    } catch (jsonError) {
      console.log(reply);
      console.error("JSON Parse Error:", jsonError);
      res.status(500).send({ error: "Yanıt JSON formatında değil. Lütfen tekrar deneyin." });
    }
  } catch (error) {
    console.error("OpenAI API Error:", error.response ? error.response.data : error.message);
    res.status(500).send({ error: error.response ? error.response.data : error.message });
  }
});

// 1. Kullanıcı ekleme endpointi
app.post('/add-user', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Name, email, and age are required' });
    }

    // Firestore'a veri ekleme
    const docRef = await db.collection('Users').add({ email, password });
    res.status(200).json({ message: 'User added successfully', docId: docRef.id });
  } catch (error) {
    res.status(500).json({ message: 'Error adding user', error: error.message });
  }
});
// 2. Kullanıcıları listeleme endpointi
app.get('/get-users', async (req, res) => {
  try {
    const snapshot = await db.collection('Users').get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

//ID ile 1 Kullanıcı getir
app.get('/get-user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userDoc = await db.collection('Users').doc(id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'Kullanici bulunamadi' });

    }

    res.status(200).json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

//Kullanıcının Programını getirme
app.get('/get-program/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userDoc = await db.collection('Users').doc(id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'Program bulunamadi' });

    }

    res.status(200).json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// 3. Kullanıcı silme endpointi
app.delete('/delete-user/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection('Users').doc(id).delete();
    res.status(200).json({ message: `User with ID ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// 4. Kullanıcı güncelleme endpointi
app.put('/update-user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, gymProgram, dietProgram, age, weight, height, gender, daysPerWeek } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'email required' });
    }

    await db.collection('Users').doc(id).update({ email, password, gymProgram, dietProgram, age, weight, height, gender, daysPerWeek });
    res.status(200).json({ message: `User with ID ${id} updated successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});
// 5. Kullanıcıyı giriş yapma endpointi
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const snapshot = await db.collection('Users').where('email', '==', email).where('password', '==', password).get();
    if (snapshot.empty) {
      return res.status(404).json({ message: 'User not found' });
    }

    // İlk bulunan dökümanın verisini ve ID'sini alın
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id; // Document ID

    res.status(200).json({
      message: 'User logged in successfully',
      user: {
        id: userId, // Document ID
        ...userData, // Kullanıcı verileri
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Dosya işlemleri için örnek fonksiyon
const hareketler = [];

function loadCsv() {
  fs.createReadStream("GymHareketler.csv")
    .pipe(csv())
    .on("data", (row) => {
      hareketler.push(row);
    })
    .on("end", () => {
      console.log("Hareketler yüklendi");
    });
}

// Sunucu başlatıldığında dosya yükleme
loadCsv();

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});