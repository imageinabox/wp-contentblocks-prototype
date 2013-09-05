// app quiz example

$(function(){

  var post = {};

  // the post model - contains all the data of the post
  post.Data = Backbone.Model.extend({
    defaults: {
      title: 'Your title here',
      content: {},
      meta: {},
    }
  });

  // Block default model
  post.Block = Backbone.Model.extend({
    defaults: {
      tag: 'div',
      remove: true,
      move: true,
      content: 'Type here'
    }
  });

  // collection of content blocks
  post.Blocks = Backbone.Collection.extend({
    model: post.Block
  })

  post.blocks = new post.Blocks();

  // the blocks view
  post.BlockView = Backbone.View.extend({
    tagName: 'div',
    className: 'content-block',
    template: _.template($('#post-block').html()),

    events: {
      'click span.remove': 'destroy'
    },

    initialize: function(){
      _.bindAll(this, 'render', 'unrender');
      this.model.bind('destroy', this.unrender);
      this.render();
    },
    render: function(){
      this.$el.html(this.template(
        {
          block_tag: this.model.get('tag'),
          block_content: this.model.get('content'),
          remove: this.model.get('remove'),
          move: this.model.get('move')
        }
      ));
      
      return this;
    },
    unrender: function(){
      // console.log('unrender');
      this.$el.remove();
    },
    destroy: function(){
      // console.log('destroy');
      this.model.destroy();
    },
  });

  // the post view
  post.View = Backbone.View.extend({
    el: '#container',
    template: _.template($('#post-template').html()),

    events: {
      'click #add-block' : 'addBlock',
      'change #post-title': 'updateTitle',
    },

    initialize: function(){
      _.bindAll(this, 'render', 'addBlock', 'updateTitle');
      this.wrapper = this.$el.find('#content');
      this.render();

      // console.log(post.blocks);
    },
    render: function(){
      // initialize the post model
      post.thePost = new post.Data();
      this.wrapper.append(this.template({post_title: post.thePost.get('title')}));

      // insert first content block
      var initBlock = new post.Block();
      initBlock.set({remove: false});
      post.blocks.add(initBlock);

      var initView = new post.BlockView({model:initBlock});
      this.wrapper.append(initView.render().el);
    },
    addBlock: function(e){

      e.preventDefault();

      var block = new post.Block();
      post.blocks.add(block);

      var newBlock = new post.BlockView({model:block});
      this.wrapper.append(newBlock.render().el);
    },
    updateTitle:function(e){
      post.thePost.set({title: $(e.target).val()});
      console.log('uptated title: '+ post.thePost.get('title'));
    }

  });

  post.view = new post.View();

});
