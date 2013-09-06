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
      wp_id: 0,
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
      'click span.remove': 'destroy',
      'mousedown .wp-block': 'addFocus',
    },

    initialize: function(){
      _.bindAll(this, 'render', 'unrender');
      this.model.bind('destroy', this.unrender);
      this.render();
    },
    render: function(){
      this.$el.html(this.template(
        {
          wp_id: this.model.get('wp_id'),
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
    addFocus: function(e){
      $(e.target).focus();
    }
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
      this.container = $('#content');
      this.wrapper = $('#content-blocks');
      
      // counter for the views
      this.counter = 0;

      this.render();

      // initial state of sortable plugin
      this.wrapper.sortable({
        handle: '.move',
        containment: '#content',
        connectWith: ".content-blocks",
      }).disableSelection();

    },
    render: function(){
      // initialize the post model
      post.thePost = new post.Data();
      this.container.prepend(this.template({post_title: post.thePost.get('title')}));

      // insert first content block
      this.counter++;
      var initBlock = new post.Block();
      initBlock.set({
        wp_id: this.counter,
        remove: false
      });
      
      // add to collection
      post.blocks.add(initBlock);

      // bind initial model to a new instance of BlockView
      var initView = new post.BlockView({model:initBlock});
      this.wrapper.append(initView.render().el);
    },
    addBlock: function(e){

      // prevent default behavior
      e.preventDefault();
      
      // creates a new instance of Block model
      this.counter++;
      var block = new post.Block({
        wp_id: this.counter
      });
      
      // add to collection
      post.blocks.add(block);
      
      // creates a new instance of BlockView and binds the new model to it
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
