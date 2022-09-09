# **Mémo Jeu en ligne : Tic Tac Toe**

Pour ce projet de jeu en ligne nous avons choisi de développer un jeu **Tic-Tac-Toe**

Pour la réalisation de ce projet nous avons choisi d’utiliser une architecture **WebSocket** qui nous semblait le mieux adapté à ce projet.

En effet il permet d’ouvrir un canal de communication **bidirectionnel** pour les navigateurs web ce qui facilite la notification du client lors d’un changement d’état du serveur et l’envoi de données à partir du serveur vers le client sans devoir effectuer une requête.
On peut aussi ajouter le terme de communication **full-duplex** ce qui inclut la bidirectionnalité. Néanmoins il permet de communiquer dans les 2 sens en même temps, ainsi nous n'avons pas à gérer la synchronisation entre le client et le serveur.

Pour notre projet **Tic-Tac-Toe** il nous était nécessaire de trouver une architecture qui nous permet une communication en temps réel entre le client et le serveur et synchroniser les choix que fait un joueur.

De plus on sera sur que la notification arrivera à destination  car les **WebSocket** utilisent une connexion TCP ce qui nous assure la bonne récéption des données.

Cette architecture nous permet donc d’avoir l'information en temps réel entre 2 joueurs lorsqu’ils jouent l’un contre l’autre pour savoir quelle case est disponible et laquelle ils peuvent cocher.

Nous avions aussi pensé à une architecture **Client-serveur** qui nous semblait être le bon choix mais sa limite et qu’il faudrait requêter une base de données et donc rafraichir le navigateur ce qui n’est pas optimal pour le projet choisi. Nous aurions pu l'utiliser aussi dans le cas où on aurait mis un minuteur pour chaque joueur mais l'application n'aurait pas été très dynamique.

De même pour une architecture **N-tiers** elle aurait été possible dans le cadre de ce projet mais il nous faut utiliser une base de données et dans le cas présent nous n’en avons pas besoin.

### **Groupe 9 MT5**