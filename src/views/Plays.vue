<template>
  <div class="flex flex-col">
    <!-- Add play -->
    <button
      class="
        fixed
        sm:static
        bottom-6
        right-6
        rounded-full
        sm:rounded-none
        w-20
        h-20
        sm:w-auto
        sm:h-auto
        sm:px-7
        sm:m-auto
        sm:mb-3
        opacity-80
        sm:opacity-100
        text-green-700 text-3xl
        sm:text-base
        border border-green-400
        hover:border-green-300
        focus:border-green-300
        bg-gradient-to-b
        from-green-200
        to-green-400
        hover:from-green-100
        hover:to-green-300
        focus:from-green-100
        focus:to-green-300
        active:from-green-100
        active:to-green-300
        shadow-lg
        sm:shadow-none
      "
      @click="modal = true"
    >
      <i class="fa fa-plus"></i>
    </button>

    <!-- Add play modal -->
    <transition name="fade">
      <div
        @click="modal = false"
        v-if="modal"
        class="
          fixed
          w-screen
          h-screen
          z-30
          top-0
          left-0
          bg-blue-900 bg-opacity-30
        "
      ></div>
    </transition>
    <transition name="slide-top">
      <div
        v-if="modal"
        class="fixed w-full h-full top-0 right-0 z-50 p-3 sm:p-6 flex flex-col"
      >
        <!-- Header -->
        <div
          class="
            flex
            justify-between
            p-3
            shadow-sm
            bg-white
            text-center
            border-b-0
          "
        >
          <span class="text-green-600 sm:text-xl font-bold"
            >Add match play</span
          >
          <!-- Close -->
          <button
            class="
              px-3
              text-blue-900
              border border-blue-300
              hover:border-blue-200
              bg-gradient-to-b
              from-blue-100
              to-blue-300
              hover:from-blue-50
              hover:to-blue-200
            "
            @click="modal = false"
          >
            <i class="fa fa-close"></i>
          </button>
        </div>
        <!-- Content -->
        <div class="relative flex flex-col p-3 bg-white overflow-auto">
          <!-- Background -->
          <div class="hidden sm:flex absolute top-0 bottom-0 left-0 right-0">
            <div
              class="
                bg-gradient-to-r
                from-green-200
                border border-green-500 border-r-0
                h-full
                w-full
              "
            ></div>
            <div
              class="
                bg-gradient-to-l
                from-red-200
                border border-red-500 border-l-0
                h-full
                w-full
              "
            ></div>
          </div>
          <!-- Form content -->
          <div class="flex flex-col space-y-3 z-10">
            <!-- Add play form -->
            <add-play-component
              @added="
                this.filter();
                modal = false;
              "
              class="w-full"
            ></add-play-component>
          </div>
        </div>
      </div>
    </transition>

    <!-- Filters -->
    <div class="grid grid-cols-3">
      <!-- Limit -->
      <div class="flex justify-start">
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

      <!-- Numbers  -->
      <div class="flex justify-center space-x-3">
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
    <div class="flex flex-col mt-3">
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
