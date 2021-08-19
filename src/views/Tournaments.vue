<template>
  <div class="flex">
    <!--Tournaments list-->
    <div class="w-20 sm:w-40">
      <!--Tournaments header-->
      <div class="flex justify-between pb-3">
        <button
          :class="[
            'px-4 bg-gradient-to-b border w-full rounded-lg shadow-lg',
            {
              'border-green-400 hover:border-green-300 text-green-900 from-green-200 to-green-400 hover:from-green-100 hover:to-green-300':
                !tAdd,
            },
            {
              'border-gray-400 hover:border-gray-300 text-gray-900 border from-gray-100 to-gray-400 hover:from-gray-100 hover:to-gray-300':
                tAdd,
            },
          ]"
          @click="tAdd = !tAdd"
        >
          <i class="fa fa-plus" v-if="!tAdd"></i>
          <i class="fa fa-trash" v-else></i>
        </button>
      </div>
      <!--Tornements-->
      <div class="flex flex-col w-full space-y-3" v-if="tournaments.length > 0">
        <transition-group name="slide-top">
          <button
            :class="[
              'bg-gradient-to-b border p-1 sm:p-2 rounded-lg min-w-full flex flex-col space-y-1 text-xs break-all shadow-xl transform transition-all',
              'text-gray-800 from-white to-gray-100 border-gray-100 ',
              'sm:p-1 sm:break-normal sm:text-base ',
              'hover:from-gray-50 hover:to-gray-200 hover:border-gray-200',
              {
                'text-blue-900 from-blue-100 to-blue-300 border-blue-300 shadow-sm hover:from-blue-100 hover:to-blue-300 hover:border-blue-300 cursor-default':
                  tournamentSelected?.id === t.id,
              },
            ]"
            v-for="t in tournaments"
            :key="t.id"
            @click="tournamentSelected = t"
          >
            <b>{{ t.name }}</b>
            <i class="hidden text-sm sm:inline-block">
              {{ moment(t.createdAt).format("MMMM D, YYYY") }}
            </i>
          </button>
        </transition-group>
      </div>
      <div v-if="tournaments.length == 0">No hay torneos</div>
    </div>
    <!-- Add and view tournament -->
    <div class="flex flex-col w-full ml-3">
      <transition name="slide-scale-top-left">
        <add-tournament-component
          class="mb-3"
          @tournament-add="
            tAdd = false;
            tournamentSelected = $event;
          "
          v-if="tAdd"
        ></add-tournament-component>
      </transition>

      <view-tournament-component
        :class="[{ 'hidden sm:flex': tAdd }, { flex: !tAdd }]"
        :tournament="tournamentSelected"
      >
      </view-tournament-component>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
import AddTournamentComponent from "@/components/tournament/AddTournamentComponent";
import ViewTournamentComponent from "@/components/tournament/ViewTournamentComponent";

export default {
  data() {
    return {
      moment: moment,
      tAdd: false,
      tournamentSelected: null,
    };
  },
  computed: {
    ...mapState({
      tournaments: (state) => state.tournaments,
    }),
  },
  components: {
    AddTournamentComponent,
    ViewTournamentComponent,
  },
};
</script>
