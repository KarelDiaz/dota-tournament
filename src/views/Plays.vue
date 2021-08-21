<template>
  <div class="flex flex-col p-2 sm:p-3">
    <!-- Add -->
    <div class="flex justify-center">
      <!-- Add play -->
      <button
        class="fixed text-xl text-green-700 border border-green-400 rounded-full shadow-lg w-14 h-14 sm:static bottom-6 right-6 sm:rounded-lg sm:w-auto sm:h-auto sm:px-7 sm:m-auto sm:mb-3 opacity-80 sm:opacity-100 sm:text-base hover:border-green-300 focus:border-green-300 bg-gradient-to-b from-green-200 to-green-400 hover:from-green-100 hover:to-green-300 focus:from-green-100 focus:to-green-300 active:from-green-100 active:to-green-300"
        @click="modal = true"
      >
        <i class="fa fa-plus"></i>
      </button>
      <!-- Modal -->
      <modal-component v-model="modal">
        <!-- Form content -->
        <div class="flex flex-col space-y-2 sm:space-y-3">
          <!-- Add play form -->
          <add-play-component
            @added="
              this.filter();
              modal = false;
            "
            class="w-full"
          ></add-play-component>
        </div>
      </modal-component>
    </div>

    <!-- Filters -->
    <div
      class="flex flex-row-reverse flex-wrap justify-between grid-cols-3 sm:grid"
    >
      <!-- Limit -->
      <div class="flex">
        <label-component title-top="Plays limit">
          <select
            class="p-2 border rounded-lg shadow-lg sm:w-auto bg-gradient-to-b from-white to-gray-100"
            v-model="filterLimit"
          >
            <option value="-1">Todos</option>
            <option value="10">10</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </label-component>
      </div>

      <!-- Numbers  -->
      <div class="flex items-center justify-center space-x-3">
        <!-- Good -->
        <span class="flex space-x-1 text-green-400">
          <b>
            {{
              plays.filter((p) => {
                if (!filterByPlayer) return p.side_win == "good";
                if (p.side_win == "good")
                  return p.player_results.find(
                    (pr) => pr.player == filterByPlayer && pr.side == p.side_win
                  );
              }).length
            }}
          </b>
          <span class="hidden sm:inline-block">good</span>
        </span>
        <!-- Plays -->
        <span class="flex space-x-1">
          <b>
            {{ plays.length }}
          </b>
          <span class="hidden sm:inline-block">plays</span>
        </span>
        <!-- victories -->
        <transition name="slide-right">
          <div class="flex space-x-1 text-yellow-400" v-if="filterByPlayer">
            <b>
              {{
                plays.filter((p) => {
                  return p.player_results.find(
                    (pr) => pr.player == filterByPlayer && pr.side == p.side_win
                  );
                }).length
              }}
            </b>
            <span class="hidden sm:inline-block">victories</span>
          </div>
        </transition>
        <!-- Bad -->
        <span class="flex space-x-1 text-red-400">
          <b>
            {{
              plays.filter((p) => {
                if (!filterByPlayer) return p.side_win == "bad";
                if (p.side_win == "bad")
                  return p.player_results.find(
                    (pr) => pr.player == filterByPlayer && pr.side == p.side_win
                  );
              }).length
            }}
          </b>
          <span class="hidden sm:inline-block">bad</span>
        </span>
      </div>

      <!-- filterbyPlayer -->
      <div class="flex justify-end">
        <label-component title-top="Filter by player" class="flex justify-end">
          <select
            class="p-2 border rounded-lg shadow-lg sm:w-auto bg-gradient-to-b from-white to-gray-100"
            v-model="filterByPlayer"
          >
            <option value>Todos</option>
            <option
              :value="p.id"
              v-for="p in players"
              :key="p.id"
              :style="p.nick == 'bot' ? 'display:none' : ''"
            >
              {{ p.nick }}
            </option>
          </select>
        </label-component>
      </div>
    </div>

    <!-- Plays -->
    <div  v-if="plays.length>0" class="flex flex-col">
      <transition-group name="slide-top" tag="p">
        <play-component
          v-for="play in plays"
          :key="play.id"
          :play="play"
          class="mt-8"
        ></play-component>
      </transition-group>
    </div>

    <!-- Empty plays -->
    <div class="p-10 italic text-center text-gray-400"  v-if="plays.length===0">
      No hay plays
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

import PlayComponent from "@/components/play/PlayComponent";
import AddPlayComponent from "@/components/play/AddPlayComponent";
import LabelComponent from "@/components/LabelComponent";
import ModalComponent from "@/components/ModalComponent.vue";

export default {
  name: "Plays",
  data() {
    return {
      modal: false,
      plays: [],
      filterLimit: 10,
      filterByPlayer: "",
    };
  },
  computed: {
    ...mapState({
      strapi: (state) => state.strapi,
      players: (state) => state.players,
      heroes: (state) => state.heroes,
    }),
  },
  components: {
    PlayComponent,
    AddPlayComponent,
    LabelComponent,
    ModalComponent,
  },
  methods: {
    filter() {
      axios.get(this.strapi + "/plays?_limit=-1").then(({ data }) => {
        this.plays = data.reverse();
        if (this.filterByPlayer != "")
          this.plays = this.plays.filter((p) => {
            return p.player_results.find(
              (pr) => pr.player == this.filterByPlayer
            );
          });
        if (this.filterLimit != -1)
          this.plays = this.plays.slice(0, this.filterLimit);
        this.plays.forEach((play) => {
          play.player_results = play.player_results.sort((a, b) => {
            if (a.side == b.side)
              if (a.side === "good") return a.bot ? -1 : 1;
              else return a.bot ? 1 : -1;

            return b.side.localeCompare(a.side);
          });
        });
      });
    },
  },
  watch: {
    filterLimit() {
      this.filter();
    },
    filterByPlayer() {
      this.filter();
    },
  },
  mounted() {
    this.filter();
  },
};
</script>
