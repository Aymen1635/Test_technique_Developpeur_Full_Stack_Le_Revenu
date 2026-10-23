export default {
  routes: [
    {
      method: 'PUT',
      path: '/discussions/:id/solution',
      handler: 'discussion.solution',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/discussions/:id/like',
      handler: 'discussion.like',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/discussions/:id/poll-vote',
      handler: 'discussion.pollVote',
      config: {
        policies: [],
      },
    },
  ],
};
