---
date: 2025-01-28
layout: article
---

# Sustain com Arduino

## O dia em que criei um pedal de sustain com Arduino nano.

Bem, pra quem não sabe, eu toco teclado desde muito tempo. E amo fazer isso, mas dizer que amo não quer dizer que toco bem...

Acontece que gosto de experimentar diferentes sons, timbres pra tocar teclado. E uma forma legal de fazer isso é usando software, claro.

Então eu tenho um controlador MIDI da Kork, o microKEY 61. E conecto ele no computador pra usar o Kontakt pra explorar diversos sons pra tocar. Só que por muito tempo sofria com a falta de um recurso essencial pra tocar teclado e piano. O pedal de Sustain.

O sustain, é um recurso que "sustenta" a nota depois de pressionar a tecla. Eu pressiono a tecla ao mesmo tempo que pressiono o pedal e sustain e o som da tecla aos poucos vai desaparecendo ao invés de desaparecer assim que deixo de pressionar a tecla. E quando eu parava de pressionar o pedal, a nota sumia na hora.

O Kork MicroKEY61 não vem com essa possibilidade de conectar um pedal de sustain. Então tinha que ativar via software, só que dessa forma não tinha como controlar quando parar a "sustentação" da nota, o que acabava "embolando" o som.

No fundo, o sinal de sustain nada mais é do que um comando MIDI. Então pensei, dá pra fazer isso com uma placa simples como Arduino, ainda mais o Arduino Nano. Só que a última vez que programei em uma placa foi nunca... Mas em época de IA pra todo lado, claro que aproveitei e com ajuda do ChatGPT me aventurei por esse caminho.

E não é que deu certo? E assim surgiu [esse](https://github.com/igorjacauna/usb-sustain-pedal) pequeno código

O código é bem simples e o GPT fez questão de deixar tudo bem comentado.

Depois de compilado, bastou conectar o Arduino via USB no computador e o pedal de sustain no Arduino e, claro, configurar o Kontakt pra reconhecer o Arduino como dispositivo MIDI de entrada e pronto!
