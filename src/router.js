import { createRouter, createWebHistory } from 'vue-router';

import TeamsList from './pages/TeamsList.vue';
import UsersList from './pages/UsersList.vue';
import TeamMembers from './components/teams/TeamMembers.vue';
import NotFound from './pages/NotFound.vue';
import TeamsFooter from './pages/TeamsFooter.vue';
import UsersFooter from './pages/UsersFooter.vue';

const router = createRouter({
  // Para que funcione el boton de atras en la propia página
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/teams' },
    {
      name: 'teams',
      path: '/teams',
      meta: { needsAuth: true },
      // Las keys, footer en este caso, tienen que ser la misma que el name que se le da al router link en el componente en el que se pone, en este caso está en App.vue
      components: { default: TeamsList, footer: TeamsFooter },
      // Los children son componentes que se cargan dentro del componente padre y han de llamarse dentro del componente con el <router-vue> para que funcione el componente en la dirección
      children: [
        {
          name: 'team-members',
          path: ':teamId',
          component: TeamMembers,
          // Activar las props para que el componente pueda recibir props, recibiendo por ejemplo por props el param del path, :teamId
          props: true
        } // /teams/t1
      ]
    }, // our-domain.com/teams => TeamsList
    {
      path: '/users',
      components: {
        default: UsersList,
        footer: UsersFooter
      },
      // before enter es como beforeEach pero solo para una ruta.
      beforeEnter(to, from, next) {
        console.log('users beforeEnter');
        console.log(to, from);
        next();
      }
    },
    { path: '/:notFound(.*)', component: NotFound }
  ],
  linkActiveClass: 'active',
  // scrollBehavior es un method que se aplica al router, no hay que llamarlo en ningún lado, los params son (to, from, savedPosition), se utiliza para que te mueva en la página,
  //  en este caso que suba arriba del todo al secelcionar algo
  scrollBehavior(_, _2, savedPosition) {
    // console.log(to, from, savedPosition);
    if (savedPosition) {
      return savedPosition;
    }
    return { left: 0, top: 0 };
  }
});

router.beforeEach(function(to, from, next) {
  console.log('Global beforeEach');
  console.log(to, from);
  if (to.meta.needsAuth) {
    console.log('Needs auth!');
    next();
  } else {
    next();
  }
  // if (to.name === 'team-members') {
  //   next();
  // } else {
  //   next({ name: 'team-members', params: { teamId: 't2' } });
  // }
  // next();
});

router.afterEach(function(to, from) {
  // sending analytics data
  console.log('Global afterEach');
  console.log(to, from);
});

export default router;