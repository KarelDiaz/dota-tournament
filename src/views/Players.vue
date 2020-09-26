<template>
  <div>
    <div class="options">
      <input type="text" placeholder="Filtrar" v-model="textFilter" @keyUp="filter" />

      <form class="add-player" @submit.prevent="send">
        <input
          class="name"
          v-model="playerForm.fullName"
          required
          type="text"
          placeholder="Escriba el nombre"
        />
        <input
          class="nick"
          v-model="playerForm.nick"
          required
          type="text"
          placeholder="Escriba el nick"
        />
        <button class="success" type="submit">
          <span v-if="idMod<0">Agregar</span>
          <span v-else-if="idMod>=0">Editar</span>
        </button>
      </form>
    </div>

    <table class="players">
      <tr>
        <th>Nombre</th>
        <th>Nick</th>
        <th>ELO ↓</th>
        <th>Active</th>
        <th></th>
      </tr>
      <tr class="players-item" v-for="p in players" :key="p.nick">
        <td>{{p.fullName}}</td>
        <td>{{p.nick}}</td>
        <td>{{p.elo}}</td>
        <td>{{p.active}}</td>
        <td>
          <button class="danger" @click="del(p.id)">Eliminar</button>
          <button @click="preMod(p.id)">Edit</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import dataurl from "@/store/dataurl";
import Player from "@/store/model/player";

export default {
  name: "Players",
  data() {
    return {
      players: [],
      playerForm: new Player(),
      textFilter: "",
      idMod: -1
    };
  },
  methods: {
    filter() {
      fetch(dataurl + "players")
        .then(res => res.json())
        .then(data => {
          this.players = data
            .filter(player => {
              // normalize texts
              let text = this.textFilter.toLowerCase();
              let name = player.fullName.toLowerCase();
              let nick = player.nick.toLowerCase();
              let elo = player.elo;

              //search text into data
              if (name.indexOf(text) >= 0) return true;
              if (nick.indexOf(text) >= 0) return true;
              if (elo == text) return true;

              return false;//discard player if no match
            })
            .sort((a, b) => {
              if (a.elo == b.elo) {
                return a.fullName > b.fullName;
              }
              return a.elo < b.elo;
            });
        });
    },

    send() {
      if (this.idMod >= 0) {
        fetch(dataurl + "players/" + this.idMod, {
          method: "PUT",
          body: JSON.stringify(this.playerForm),
          headers: {
            Accept: "application/json",
            "Content-type": "application/json"
          }
        }).then(() => {
          this.filter();
          this.playerForm = new Player();
        });
      } else {
        fetch(dataurl + "players", {
          method: "POST",
          body: JSON.stringify(this.playerForm),
          headers: {
            Accept: "application/json",
            "Content-type": "application/json"
          }
        })
          .then(res => res.json())
          .then(() => {
            this.playerForm = new Player();
            this.filter();
          });
      }
      this.idMod = -1;
    },

    preMod(id) {
      fetch(dataurl + "players/" + id)
        .then(res => res.json())
        .then(data => {
          this.idMod = id;
          this.playerForm = new Player(
            data.fullName,
            data.nick,
            data.elo,
            data.active
          );
        });
    },

    del(id) {
      if (confirm("Estas seguro de eliminar el player"))
        fetch(dataurl + "players/" + id, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json"
          }
        }).then(() => {
          this.players = this.players.filter(p => p.id != id);
        });
    }
  },
  created() {
    this.filter();
  }
};
</script>

<style lang="scss" scoped>
.options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;

  .add-player {
    display: flex;

    .name {
      border-right: none;
    }
  }
}

.players {
  width: 100%;
  text-align: left;

  &-item {
    &:nth-child(odd) {
      background-color: rgb(240, 240, 240);
    }

    &:hover {
      background-color: rgb(220, 220, 220);
    }
  }
}
</style>
