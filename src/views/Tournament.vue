<template>
  <div class="flex">
    <!--Tournaments list-->
    <div class="p-3">
      <!--Tournaments header-->
      <div class="flex justify-between pb-3">
        <button
          :class="[
            'px-4 bg-gradient-to-b border',
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
        <b :class="['ml-3', { 'hidden sm:flex': tAdd }, { flex: !tAdd }]">
          Tournaments
        </b>
      </div>
      <!--Tornements-->
      <div
        :class="[
          'flex-col space-y-3',
          { 'hidden sm:flex': tAdd },
          { flex: !tAdd },
        ]"
        v-if="tournaments.length > 0"
      >
        <button
          :class="[
            'bg-gradient-to-bl border p-3 flex flex-col space-y-1',
            {
              'text-blue-900 border-blue-400 hover:border-blue-300 from-blue-100 to-blue-400 hover:from-blue-100 hover:to-blue-300':
                tournamentSelected != t,
            },
            {
              'text-green-900 border-green-200  from-green-50 to-green-200 cursor-default':
                tournamentSelected == t,
            },
          ]"
          v-for="t in tournaments"
          :key="t.id"
          @click="tournamentSelected = t"
        >
          <b>{{ t.name }}</b>
          <i class="text-sm">{{
            moment(t.createdAt).format("MMMM D, YYYY")
          }}</i>
        </button>
      </div>
      <div v-if="tournaments.length == 0">No hay torneos</div>
    </div>
    <div class="flex flex-col my-3 mr-3 w-full">
      <add-tournament-component
        class="mr-3 mb-3"
        @tournament-add="this.tAdd = false"
        v-if="tAdd"
      ></add-tournament-component>
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
import AddTournamentComponent from "@/components/AddTournamentComponent";
import ViewTournamentComponent from "@/components/ViewTournamentComponent";

export default {
  data() {
    return {
      moment: moment,
      tAdd: false,
      tournamentSelected: {},
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
