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

async function getCourses() {
  //const courses = await Course.find();
  //const courses = await Course.find({ author: "TA2LSM", tags: "node", isPublished: true });
  const courses = await Course.find({ author: "TA2LSM", isPublished: true })
    .limit(10)
    .sort({ name: 1 }) // 1: artan sırada, -1: azalan sırada sırala demek
    .select({ name: 1, tags: 1 }); // sadece name ve tags alanı dolu olanları alır
  console.log(courses);
}

getCourses();
