/*
1- richiamo la libreria mongoose;
2- alla const Schema assegno mongoose.Schema (una funzione di mongo);
3- alla const userschema assegno una creazionew NEW di SCHEMA quindi i dati
   richiesti nel'oggetto che dovra essere salvato;
4- a una const User assegno mongoose.model("user", userSchema) che sarebbero
   nome della collezione e appunto il tipo di collezione;
5- esporto User;
*/
const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;
const UserSchema = new Schema({
    nome    : String,
    cognome : String,
    eta     : Number
});

const User = mongoose.model("utente", UserSchema);

module.exports = User;
