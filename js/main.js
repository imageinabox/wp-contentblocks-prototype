// app quiz example

$(function(){

  // the object that contains all the post blocks type:
  var customBlocks = {
    text: {
      name: 'Text',
      objType: 'wp-text',
      icon: 'dashicons-format-aside'
    },
    image: {
      name: 'Image',
      objType: 'wp-image',
      icon: 'dashicons-format-image'
    },
    gallery: {
      name: 'Gallery',
      objType: 'wp-gallery',
      icon: 'dashicons-format-gallery'
    },
    audio: {
      name: 'Audio',
      objType: 'wp-audio',
      icon: 'dashicons-format-audio'
    },
    video: {
      name: 'Video',
      objType: 'wp-video',
      icon: 'dashicons-format-video'
    },
    code: {
      name: 'Code',
      objType: 'wp-code',
      icon: 'dashicons-format-status'
    },
    tweet: {
      name: 'Tweet',
      objType: 'wp-tweet',
      icon: 'dashicons-twitter1'
    },
    quote: {
      name: 'Quote',
      objType: 'wp-quote',
      icon: 'dashicons-format-quote'
    },
    embed: {
      name: 'Embed',
      objType: 'wp-embed',
      icon: 'dashicons-welcome-add-page'
    }
  }

  // creating the content blocks selector menu 
  var blockTpl ='';

  _.each(customBlocks, function(blk){
    blockTpl += _.template($('#blocks-template').html(), {name: blk.name, objType: blk.objType, icon: blk.icon});
  });

  $('#blocksSelect').append(blockTpl);


  // custom function to transform a title in a slug - from http://stackoverflow.com/questions/1053902/how-to-convert-a-title-to-a-url-slug-in-jquery
  function convertToSlug(Text) {
      return Text
          .toLowerCase()
          .replace(/[^\w ]+/g,'')
          .replace(/ +/g,'-')
          ;
  }

  // the post namespace
  var post = {};

  // the post model - contains all the data of the post
  post.Data = Backbone.Model.extend({
    defaults: {
      title: 'Your title here',
      permalink: '',
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
      type: 'wp-text',
      title: 'Text',
      body: 'Type here'
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
    // template: _.template($('#wp-text').html()),

    events: {
      'click span.remove': 'destroy',
    },

    initialize: function(){
      _.bindAll(this, 'render', 'unrender');
      this.model.bind('destroy', this.unrender);

      this.template = _.template($('#'+this.model.get('type')).html());

      this.render();
    },
    render: function(){

      this.$el.html(this.template(
        {
          wp_id: this.model.get('wp_id'),
          block_tag: this.model.get('tag'),
          block_type: this.model.get('type'),
          block_content: this.model.get('body'),
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
    }
  });

  // the post view
  post.View = Backbone.View.extend({
    el: '#post',
    template: _.template($('#post-template').html()),

    events: {
      'click #add-block' : 'blockMenu',
      'click .customBlock' : 'addBlock',
      'change #post-title': 'updateTitle',
      'click #permalink-edit': 'updatePermalink',
      'keypress #post-permalink': 'savePermalink',
      'click #save-button': 'savePost',
      // this is where etch.js works
      'mousedown .editable': 'editableClick'
    },

    initialize: function(){
      _.bindAll(this, 'render', 'addBlock', 'blockMenu','updateTitle');
      this.container = $('#content');
      this.wrapper = $('#content-blocks');
      this.addBtn = $('#blocksSelect');
      
      // counter for the views
      this.counter = 0;

      this.render();

      // initial state of sortable plugin
      this.wrapper.sortable({
        handle: '.move',
        // containment: '#container',
        connectWith: ".content-blocks",
        placeholder: "blocks-placeholder",
        start: function(e, ui){
          ui.placeholder.height(ui.item.outerHeight());
        }
      });

    },
    render: function(){
      // initialize the post model
      post.thePost = new post.Data();
      this.container.prepend(this.template({
        post_title: post.thePost.get('title'),
        post_permalink: post.thePost.get('permalink')
      }));

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
    blockMenu: function(e){
      // prevent default behavior
      e.preventDefault();

      this.addBtn.toggleClass('active');
    },
    addBlock: function(e){
      var objType = $(e.currentTarget).data('type');

      // creates a new instance of Block model
      this.counter++;
      var block = new post.Block({
        wp_id: this.counter,
        type: objType
      });
      
      // add to collection
      post.blocks.add(block);
      this.addBtn.removeClass('active');

      // creates a new instance of BlockView and binds the new model to it
      var newBlock = new post.BlockView({model:block});
      this.wrapper.append(newBlock.render().el);

    },
    updateTitle:function(e){
      var value = $(e.target).val();
      post.thePost.set({title: value, permalink: convertToSlug(value)});
      console.log('uptated title: '+ post.thePost.get('title') + ', permalink: '+ post.thePost.get('permalink'));
      $('#post-permalink').val(post.thePost.get('permalink'));
      $('#permalink-text').html(post.thePost.get('permalink'));
    },
    updatePermalink:function(){
      $('#permalink-text, #permalink-edit').hide();
      $('#post-permalink').show();
    },
    savePermalink: function(e){
      if(e.which == 13) { //execute on enter
        post.thePost.set({permalink: convertToSlug($(e.target).val())});
        $('#permalink-text').html(post.thePost.get('permalink')).show()
        $('#post-permalink').hide();
        $('#permalink-edit').show();
      }
    },
    savePost: function(){
      alert('Here we need to get all the data from post.Blocks collection, serialize it and save on the database. The post.Data model will hold the content when the post is loaded, then it should pass it to the post.Blocks collection to rebuild the content blocks.');
    },
    // here is where etch.js works
    editableClick: etch.editableInit,

  });

  // removing "save" button from etch.js classes
  etch.config.buttonClasses = {
    'default': ['save'],
    'all': ['bold', 'italic', 'underline', 'unordered-list', 'ordered-list', 'link', 'clear-formatting'],
    'title': ['bold', 'italic', 'underline']
  };

  post.view = new post.View();

  $('#modal-close').click(function(){
    $('#modal-init').hide();
  });

});
