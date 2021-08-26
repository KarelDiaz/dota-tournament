<template>
  <div class="flex flex-col p-2 space-y-2 sm:space-y-3 sm:p-3">
    <clean-component></clean-component>
    <!-- Dota Tournament -->
    <div class="flex flex-col space-y-3">
      <!-- Dota Tournament img -->
      <div
        class="flex flex-col items-center justify-center space-x-3 text-center  sm:flex-row"
      >
        <img class="h-14 w-14" src="favicon.png" alt="" />
        <div class="ml-3 text-5xl font-extrabold">
          <span
            class="my-auto text-transparent  bg-clip-text bg-gradient-to-b from-blue-500 to-blue-800"
          >
            Dota Tournament
          </span>
        </div>
      </div>
      <!-- Dota Tournament links -->
      <div class="flex justify-center space-x-3 sm:space-x-20">
        <a
          class="flex flex-col items-center space-x-2  sm:flex-row hover:text-indigo-400"
          target="blanck"
          :href="$store.state.github.frontend"
        >
          <i class="text-3xl fa fa-github"></i>
          <span>Frontend <i class="fa fa-external-link"></i></span>
        </a>
        <a
          class="flex flex-col items-center space-x-2  sm:flex-row hover:text-indigo-400"
          target="blanck"
          :href="$store.state.github.backend"
        >
          <i class="text-3xl fa fa-github"></i>
          <span>Backend <i class="fa fa-external-link"></i></span>
        </a>
      </div>
    </div>
    <!-- Tecs -->
    <div class="grid grid-cols-2 gap-6 py-6 sm:grid-cols-4">
      <!-- Vue -->
      <a
        target="blanck"
        href="https://vuejs.org"
        class="flex flex-col items-center space-y-3 hover:text-indigo-400"
      >
        <!-- Dota Tournament img -->
        <img class="h-14 w-14" src="@/assets/vue.png" alt="" />
        <!-- Dota Tournament links -->
        <div>Vue <i class="fa fa-external-link"></i></div>
      </a>
      <!-- Tailwind -->
      <a
        target="blanck"
        href="https://tailwindcss.com"
        class="flex flex-col items-center space-y-3 hover:text-indigo-400"
      >
        <!-- Dota Tournament img -->
        <img class="h-14 w-14" src="@/assets/tailwind.png" alt="" />
        <!-- Dota Tournament links -->
        <div>Tailwind <i class="fa fa-external-link"></i></div>
      </a>
      <!-- Strapi -->
      <a
        target="blanck"
        href="https://strapi.io"
        class="flex flex-col items-center space-y-3 hover:text-indigo-400"
      >
        <!-- Dota Tournament img -->
        <img class="h-14 w-14" src="@/assets/strapi.png" alt="" />
        <!-- Dota Tournament links -->
        <div>Strapi <i class="fa fa-external-link"></i></div>
      </a>
      <!-- Mongodb -->
      <a
        target="blanck"
        href="https://mongodb.com"
        class="flex flex-col items-center space-y-3 hover:text-indigo-400"
      >
        <!-- Dota Tournament img -->
        <img class="h-14 w-14" src="@/assets/mongodb.png" alt="" />
        <!-- Dota Tournament links -->
        <div>Mongodb <i class="fa fa-external-link"></i></div>
      </a>
    </div>
    <!-- Views info -->
    <div class="flex flex-col space-y-3">
      <!-- Playes -->
      <div class="info">
        <b>Players</b>
        <p>
          En la vista <i class="text-blue-500"><b>Players</b></i> se puede
          modificar tocando el nombre. Ademas, se muestran estadisticas de forma
          detallada de cada players.
        </p>
        <p>Significado de las columnas de la tabla:</p>
        <div class="px-3">
          <p><b>MMR</b>: valor adquido por partidas ganadas.</p>
          <p><b>P</b>: cantidad de plays total efectuados por el player</p>
          <p><b>V</b>: cantidad de victorias del player.</p>
          <p>
            <b>AVE</b>: basado en el average del baseboll, es el pormil de
            victorias respecto al total de plays.
          </p>
          <p><b>K</b>: total de kills .</p>
          <p><b>K/P</b>: promedio de kills por play.</p>
          <p><b>D</b>: total de deths.</p>
          <p><b>D/P</b>: promedio de deths.</p>
          <p><b>A</b>: total de asistencias.</p>
          <p><b>A/P</b>: promedio de asistencias.</p>
        </div>
        <p>
          Tocando un player cualquiera se despliega debajo el historial de
          juegos. Las lineas <b class="text-green-500">verdes</b> son los juegos
          ganados y los <b class="text-red-500">rojos</b> los perdidos. Y puedes
          tocar cada linea y ver la informacion detallada de ese play.
        </p>
      </div>

      <!-- Plays -->
      <div class="info">
        <b>Plays</b>
        <p>
          En esta vista se encuantran todos los plays efectuados. Puede
          agragarse un play utilizando el botton verde con el simbolo
          <i class="text-green-500 fa fa-plus"></i>.
        </p>
        <p>
          El boton <i class="text-green-500 fa fa-plus"></i> abre una formulario
          en el cual se agrega toda la informacion del play. El formulario es
          sencilo, tiene las 10 capacidades predefinidas para los 10 players.
          Los cuales inician como bot pero con solo tocar el boton que dice
          <b>Bot</b> se cambia a <b>Player</b>. Apareciendo toda la informacion
          necesaria para un player: Player, Kills, Deths, Asists, Hero.
        </p>
        <p>
          En la lista de plays es posible utilizar filtros que actualiza los
          plays mostrados. A la izquierda se ecuentra el filtro limite, el cual
          limita la cantidad de plays a mostrar. Y a la derecha se encuetra el
          filtro por player, que solo motrara los plays en los cuales participa
          el player.
        </p>
      </div>

      <!-- Tournaments -->
      <div class="info">
        <b>Tournaments</b>
        <p>
          Lo primero que encontraras en dicha vista es una lista de todos
          torneos activos. El la parte superior se encuentra el boton
          <i class="text-green-500 fa fa-plus"></i> para agregar un nuevo
          troneo.
        </p>
        <p>
          Para gestionar un torneo simplemente se toca. Ya dentro del torneo se
          veran 2 columnas.
        </p>
        <p>
          La primera columna son los equipos que participan en el torneo.
          Ordenados por diferentes criterios, pero el de mas importancia es la
          cantidad de partidos ganados dentro del torneo. Cada equipo tiene tres
          valores. El primero de color <b class="text-gray-700">negro</b> es la
          cantidad de partidos totales. El segundo es de color
          <b class="text-green-500">verde</b> el cual son los partidos ganados.
          El tres es de color <b class="text-red-500">rojo</b> son los partidos
          perdidos.
        </p>
        <p>
          Y dentro la segundo columna, del torneo, son todos los encuentros del
          troneo. Los encuentros con el borde discontinuo signifa que todavia no
          hay plays por realizarce entre esos dos equipos. Al tocar el encutro
          se abre el formulario de agragar play. El cual se autocompleta con los
          players de cada team.
        </p>
        <p>Los ecuentros completados se representan en verde completo.</p>
      </div>

      <!-- Heroes -->
      <div class="info">
        <b>Heroes</b>
        <p>
          En esta vista sencilla se puede ver la estadista por heroe. Y cuales
          son las estadisticas por cada player. Solamente debe tocar el hereo q
          desee o puede filtrar los heroes para econtrarlo rapido.
        </p>
      </div>

      <!-- Lotery -->
      <div class="info">
        <b>Lotery</b>
        <p>Esta vista esta dividade en 3 columnas:</p>

        <div class="flex flex-col space-y-1">
          <p>
            Columna 1: Contiene todos los players de los cuales puede tocar para
            que pase para la columna 2.
          </p>
          <p>
            Columna 2: Estan los playes seleccionados. Pueden sen retornados con
            tocarlos de forma independiente o todos con el botton
            <i class="fa fa-trash"></i>. Y tocando el boton
            <i class="text-green-400 fa fa-arrow-right"></i> pasara un player de
            forma aleatoria a la comlumna 3.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CleanComponent from "@/components/CleanComponent.vue";

export default {
  components: {
    CleanComponent,
  },
};
</script>

<style lang="scss" scoped>
.info {
  @apply flex flex-col p-3 space-y-1 border bg-gradient-to-br from-gray-50 shadow-lg rounded-lg;
}
</style>