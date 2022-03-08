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
