<template>
  <div>
    <!--Tornements and view -->
    <div class="fixed bottom-0 left-0 right-0 top-14">
      <div class="flex flex-col w-full h-full sm:flex-row">
        <!--Tornements-->
        <div class="flex w-full overflow-x-hidden border-b sm:w-40 min-h-24 sm:overflow-y-auto sm:border-b-0 sm:border-r sm:flex-col">
          <!--Tournaments add-->
          <div class="p-2 bg-white border-r shadow-lg h10 sm:border-r-0 sm:border-b">
            <button
              class="w-full h-full px-4 text-green-900 border border-green-400 rounded-lg shadow-md bg-gradient-to-b hover:border-green-300 from-green-200 to-green-400 hover:from-green-100 hover:to-green-300"
              @click="modal = true"
            >
              <i class="fa fa-plus"></i>
            </button>
          </div>
          <!--Tournaments list-->
          <div
            class="flex p-2 space-x-2 overflow-auto sm:space-x-0 sm:space-y-2 sm:flex-col"
            v-if="tournaments.length > 0"
          >
            <transition-group name="slide-top">
              <button
                :class="[
                  'justify-center bg-gradient-to-b border p-1 sm:p-2 rounded-lg w-64 sm:w-full flex flex-col space-y-1 text-xs shadow-md transform transition-all',
                  'text-gray-800 from-white to-gray-100 border-gray-100 ',
                  'sm:p-1 sm:text-base ',
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
          <!-- Tournament list empty -->
          <div
            class="italic text-center text-gray-400"
            v-if="tournaments.length == 0"
          >
            No hay torneos
          </div>
        </div>
        <!-- View tournament -->
        <div class="w-full overflow-auto">
          <view-tournament-component :tournament="tournamentSelected">
          </view-tournament-component>
        </div>
      </div>
    </div>
    <!-- Modal add tournament -->
    <modal-component v-model="modal">
      <add-tournament-component
        @tournament-add="
          modal = false;
          tournamentSelected = $event;
        "
        v-if="modal"
      ></add-tournament-component>
    </modal-component>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
import AddTournamentComponent from "@/components/tournament/AddTournamentComponent";
import ViewTournamentComponent from "@/components/tournament/ViewTournamentComponent";
import ModalComponent from "@/components/ModalComponent.vue";

export default {
  data() {
    return {
      moment: moment,
      modal: false,
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
    ModalComponent,
  },
};
</script>
