<template>
  <div>
    <add-play-component class="px-3" @added="this.filter"></add-play-component>

    <!-- Filters -->
    <div class="flex justify-between mx-3 mt-6">
      <!-- Limit -->
      <div class="flex">
        <span
          class="
            hidden
            sm:flex
            pr-2
            py-1
            bg-gradient-to-l
            from-gray-100
            text-gray-700
          "
        >
          Plays limit:
        </span>
        <select
          class="
            px-2
            py-1
            cursor-pointer
            border border-gray-300
            hover:border-gray-200
            bg-gradient-to-b
            from-gray-100
            to-gray-300
            hover:from-gray-50
            hover:to-gray-200
          "
          v-model="filterLimit"
        >
          <option value="-1">Todos</option>
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <!-- Plays length  -->
      <div>
        <b>{{ plays.length }}</b> plays
      </div>
      <!-- victoris -->
      <transition name="slide-right">
        <div v-if="filterByPlayer">
          <b>
            {{
              plays.filter((p) => {
                return p.player_results.find(
                  (pr) => pr.player == filterByPlayer && pr.side == p.side_win
                );
              }).length
            }}
          </b>
          victoris
        </div>
      </transition>
      <!-- filterbyPlayer -->
      <div class="flex">
        <span
          class="
            hidden
            sm:flex
            pr-2
            py-1
            text-gray-700
            bg-gradient-to-l
            from-gray-100
          "
        >
          Filter by player:
        </span>
        <select
          class="
            px-2
            py-1
            cursor-pointer
            border border-gray-300
            hover:border-gray-200
            bg-gradient-to-b
            from-gray-100
            to-gray-300
            hover:from-gray-50
            hover:to-gray-200
          "
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
      </div>
    </div>

    <!-- Plays -->
    <div class="flex flex-col mx-3 mt-3">
      <transition-group name="slide-top" tag="p">
        <PlayComponent
          v-for="play in plays"
          :key="play.id"
          :play="play"
          class="mb-3"
        ></PlayComponent>
      </transition-group>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

import PlayComponent from "@/components/PlayComponent";
import AddPlayComponent from "@/components/AddPlayComponent";

export default {
  name: "Plays",
  data() {
    return {
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
            if (a.side == b.side) {
              return a.bot;
            }
            return a.side < b.side;
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
