<template>
  <div class="content">
    <div>
      <button @click="show = !show">Toggle</button>

      <transition name="fade" appear>
        <p v-if="show">hello</p>
      </transition>
    </div>

    <div>
      <button @click="show = !show">Toggle render</button>

      <transition name="slide-fade" appear>
        <p v-if="show">hello</p>
      </transition>
    </div>

    <div>
      <button @click="show = !show">Toggle show</button>
      <transition name="bounce" appear>
        <p v-if="show">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis
          enim libero, at lacinia diam fermentum id. Pellentesque habitant morbi
          tristique senectus et netus.
        </p>
      </transition>
    </div>

    <div>
      <button @click="add">Add</button>
      <button @click="remove">Remove</button>
      <transition-group name="list" tag="p">
        <span v-for="item in items" :key="item" class="list-item">{{ item }}</span>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      docState: "edited",
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      nextNum: 10,
    };
  },
  methods: {
    randomIndex() {
      return Math.floor(Math.random() * this.items.length);
    },
    add() {
      this.items.splice(this.randomIndex(), 0, this.nextNum++);
    },
    remove() {
      this.items.splice(this.randomIndex(), 1);
    },
    beforeEnter(el) {
      el.style.opacity = 0;
      el.style.height = 0;
    }
  },
  computed: {
    computedList() {
      var vm = this;
      return this.list.filter(item => {
        return item.msg.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  div {
    height: 100px;
    margin: 10px;
  }
}

/*********************************/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/*********************************/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
/********************************** */
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
/************************************* */
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
/************************************ */
.flip-list-move {
  transition: transform 0.8s ease;
}
</style>