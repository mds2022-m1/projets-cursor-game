# 📝 CursorGame
CursorGame est un jeu où les joueurs peuvent se retrouver sur un plateau et voir les curseurs des autres joueurs. Le but est de survivre le plus longtemps possible sur le plateau.

L'accès au jeu est limité à 3 joueurs en même temps. La liste 

# 🎉 Lancer le projet
Pour lancer le projet, il faut ouvrir un terminal et lancer la commande :
```
 yarn install
```

Ensuite, pour lancer le projet côté Front, il faut ouvrir un terminal et lancer la commande :
```
 yarn run dev
```

Pour le Back, il faut ouvrir un autre terminal avec la commande :
```
 yarn run serve
```
Et l'application est lancée !

# 🚨 Le projet
C'est avec ce projet que j'ai découvert les websockets et j'avoue que c'est vachement utile ! 
Par contre, au début, je suis parti sur une librairie assez compliquée et peu documentée (comme je l'ai dit à ma présentation).
Puis après, avec **socket.io**, c'était beaucoup plus simple et plus rapide, je suis donc resté là-dessus.

Au départ, je suis parti en faisant du JS from scratch car cela faisait longtemps que je n'en avait pas fait.
L'application fonctionnait bien mais, si je voulais faire tout ce que je souhaitais, cela allait prendre plus de temps en JS et j'ai donc décidé de passer sur du React pour cette raison mais également pour moi et voir un peu la différence entre le Framework et le JS Vanilla. 
J'avoue que j'ai pas mal galéré sur cette étape et ça m'a pris un peu de temps, il y a pleins de choses qui n'aillait pas mais je m'en suis quand même sorti !

Aussi, c'est la première fois que je faisais du Typescript, j'ai donc appris à l'utiliser et il est peut-être pas utilisé correctement de partout (avec quelques ***any*** possibles...).
Par contre, je l'avais bien mis en place sur le serveur NodeJS mais il se trouve que la semaine dernière, je n'arrivais plus à le lancer car node ne reconnaissait plus l'extension **.ts** et j'ai donc du repasser en JS car impossible de régler le problème.

Pour l'instant, le projet permet juste de se connecter, être dans la file d'attente et de voir les curseurs des autres joueurs, tout en pouvant discuter avec eux par un chat.
Je me suis vraiment concentré sur l'utilisation des websockets et je n'ai, malheureusement, pas eu le temps de faire d'ajouts, notamment pour que les curseurs jouent entre eux et on pourrait clairement aussi optimiser le code.

Surtout que c'était assez compliqué pour moi de bosser en dehors des heures de cours. Cependant, je compte bien essayer de continuer le projet pour le finir et pouvoir l'ajouter à mon portfolio !

Enfin, pour l'hébergement, il n'est pas possible d'utiliser Vercel car il ne gère pas les websockets.
J'ai donc voulu utiliser Heroku à la place mais ils n'ont plus d'offres étudiantes 😥 et, pour l'instant, je n'ai pas trouvé d'alternative gratuite pour pouvoir l'héberger.

# 📚 Les ressources
- [Socket.io](https://socket.io/)
- [Socket.io-client](https://socket.io/docs/v3/client-api/index.html)
