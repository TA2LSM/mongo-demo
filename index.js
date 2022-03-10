const mongoose = require("mongoose");

//mongoose.connect("mongodb://localhost/playground"); //bu method bir promise döner
// deployment yapılacağı zaman config dosyasında gerçek database adresi olmalı
// yukarıdaki database olmasa bile ilk kez bu database'e birşey yazılacağı zaman
// mongodb otomatik olarak bu database'i oluşturacaktır.

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => {
    console.error("Couldn't connect to MongoDB!", err);
  });

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  //date: Date,
  date: { type: Date, default: Date.now },
  // date tanımlanmadığında, default olarak oluşturulduğu an, date verisi olarak kullanılır
  isPublished: Boolean,
});

// Class için PascalCase, objeler için camelCase kullanılır
// PascalCase yazım: her kelimenin ilk harfi büyük
const Course = mongoose.model("Course", courseSchema);
// Eşittirden sonrası için Course document'i altına atılacak herşey courseSchema tanımlamasına
// uygun olacak. Eşittirden öncesi için Course bir class'ı temsil ediyor. Objeyi DEĞİL!
// yukarıdki kodun anlamı (kişisel yorum) model() methodu (fonksiyonu) ile "Course" dökümanları
// altında, courseSchema'sına göre öğeler oluşturan bir fonksiyon yaratmak. Aşağıda Course()
// fonksiyonu kullanılacak ve parametre olarak da bir obje alacak...

async function createCourse() {
  // camelCase yazım: ilk kelimenin ilk harfi küçük diğer her kelimenin ilk harfi büyük
  const course = new Course({
    name: "Angular Course",
    author: "TA2LSM",
    tags: ["angular", "frontend"],
    //date: ...
    isPublished: true,
  });
  // Bu yazım tarzına schemaless deniyor. Birbiri ile ilintili database'ler yapmak için evvelden
  // course, tags ...vs bunları ayrı ayrı tablolar halinde yazmak gerekiyormuş. Şimdi ise bir obje
  // oluşturmak ve bunu database'e yazmak yeterli.

  // aşağıdaki işlem belli bir süre alacağı için kod kesintisi olamaması adına async bir işlemdir ve
  // bir promise döner. MongoDB "_id:" öğesini kendisi ilgili obje içine ekler ve bu unique bir değerdir.
  // Ayrıca "__v:" olarak mongoDB ayrıca bir alan ekler.
  // await işlemi ancak bir async fonksiyon içinde kullanılabileceği için tüm bu kod parçası fonksiyon
  // olarak yazıldı.
  const result = await course.save();
  console.log(result);
}

// async function getCourses() {
//   //const courses = await Course.find();
//   //const courses = await Course.find({ author: "TA2LSM", tags: "node", isPublished: true });
//   const courses = await Course.find({ author: "TA2LSM", isPublished: true })
//     .limit(10)
//     .sort({ name: 1 }) // 1: artan sırada, -1: azalan sırada sırala demek
//     .select({ name: 1, tags: 1 }); // sadece name ve tags alanı dolu olanları bul
//   console.log(courses);
// }

// async function getCourses() {
//   // Karşılaştırma operatörleri
//   // ep (equal)
//   // ne (not equal)
//   // gt (greater than)
//   // gte (greater than or equal to)
//   // lt (less than)
//   // lte (less than or equal to)
//   // in
//   // nin (not in)

//   const courses = await Course
//     //.find({ price: 10 }) // sadece 10 dolar olan kursları bulmak için
//     //.find({ price: { $gte: 10, $lte: 20 } }) // 10 ve 20 dolar arası ve o değerlere eşit olanlar
//     //$ ile gte'nin bir operatör olduğunu belirtip obje içine obje girişi yaparak yazılır
//     .find({ price: { $in: [10, 15, 20] } }) //10, 15 ya da 20 dolar olanları bulur
//     .limit(10)
//     .sort({ name: 1 })
//     .select({ name: 1, tags: 1 });
//   console.log(courses);
// }

// async function getCourses() {
//   // Lojik Operatörler
//   // or
//   // and

//   const courses = await Course.find() // find metodu parametresiz çağrılır
//     //.or([{ author: "TA2LSM" }, { isPublished: true }]) // dizi içindeki her obje bir arama filtresi olarak kullanılır
//     // TA2LSM tarafından hazırlanmış YA DA sadece yayınlanmış kursları bul
//     .and([{ author: "TA2LSM" }, { isPublished: true }])
//     // TA2LSM tarafından hazırlanmış VE sadece yayınlanmış kursları bul
//     .limit(10) // en fazla 10 kurs bul
//     .sort({ name: 1 }) // 1: artan sırada, -1: azalan sırada sırala demek
//     .select({ name: 1, tags: 1 }); // sadece name ve tags alanı dolu olanları bul
//   console.log(courses);
// }

// async function getCourses() {
//   // Burada mesela yayıncı kesinlikle "TA2LSM" olmalı yoksa kursları bualamaz.
//   // TA2L, TA2 gibi kurs sahibi isimleri olsaydı bunlara da erişmek isteseydik o zaman
//   // regular epression kullanmamız gerekir.

//   // Regular Expression (fazlası için "JAVA script regular expressions" dökümanı okunabilir)
//   // /^.../ >> birşey (...) ile başlayan (case sensitive)
//   // /...$/ >> birşey (...) ile bitenler (case sensitive)
//   // /...$/i >> birşey (...) ile bitenler (case insensitive with i parameter at the end)
//   // /.* ... .*/ >> birşey (...) içerenler (başında ve sonunda birşey olmasa da bulur)

//   const courses = await Course
//     //.find({ author: /^TA2/ }) // TA2 ile başlayanlar
//     //.find({ author: /SM$/i }) // TA2 ile bitenler
//     .find({ author: /.*TA2LSM.*/i }) // TA2LSM içerenler (case insensitive)
//     .limit(10)
//     .sort({ name: 1 }) // 1: artan sırada, -1: azalan sırada sırala demek
//     .select({ name: 1, tags: 1 }); // sadece name ve tags alanı dolu olanları bul
//   console.log(courses);
// }

// async function getCourses() {
//   const courses = await Course.find({ author: "TA2LSM", isPublished: true })
//     .limit(10)
//     .sort({ name: 1 }) // 1: artan sırada, -1: azalan sırada sırala demek
//     .count(); // yukarıdaki kriterlere uyan kaç döküman var bulur
//   console.log(courses);
// }

// her sayfada belirli bir adette kurs listelemek için bir örnek
async function getCourses() {
  const pageNumber = 2;
  const pageSize = 10;
  // /api/courses?pageNumber=2&pageSize=10

  const courses = await Course.find({ author: "TA2LSM", isPublished: true })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ name: 1 }) // 1: artan sırada, -1: azalan sırada sırala demek
    .select({ name: 1, tags: 1 }); // sadece name ve tags alanı dolu olanları bul
  console.log(courses);
}

getCourses();
