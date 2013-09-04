// app quiz example

$(function(){

  var post = {};

  // the post model - contains all the data of the post
  post.Data = Backbone.Model.extend({
    defaults: {
      title: 'Your answer here',
      content: {},
      meta: {},
    }
  });

  // Block default model
  post.Block = Backbone.Model.extend({
    defaults: {
      tag: 'div',
      content: 'Type here'
    }
  });

  // collection of content blocks
  post.Blocks = Backbone.Collection.extend({
    model: post.Block
  })

  post.blocks = new post.Blocks({
    id:1,
    tag: 'div',
    content: 'Type your content here...'
  });

  // the blocks view
  post.BlockView = Backbone.View.extend({
    tagName: 'div',
    className: 'content-block',
    template: _.template($('#post-block').html()),

    events: {
      'click .remove': 'destroy'
    },

    initialize: function(){
      _.bindAll(this, 'render');
      this.model.bind('destroy', this.unrender);
      this.render();
    },
    render: function(){
      this.$el.html(this.template(
        {
          block_tag: this.model.get('tag'),
          block_content: this.model.get('content')
        }
      ));
      
      return this;
    },
    unrender: function(){
      console.log('unrender');
      $(this.el).remove();
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
    },
    render: function(){
      // initialize the post model
      post.thePost = new post.Data();
      this.wrapper.html(this.template({post_title: post.thePost.get('title')}));
    },
    addBlock: function(){
      console.log('add block menu');

      var block = new post.Block();
      post.blocks.add(block)

      var newBlock = new post.BlockView({model:block});
      this.wrapper.append(newBlock.render().el);
    },
    updateTitle:function(e){
      post.thePost.set({title: $(e.target).val()});
      console.log('uptated title: '+ post.thePost.get('title'));
    }

  });

  post.view = new post.View();

  // // var answer = new app.Answer();

  // app.AnswerList = Backbone.Collection.extend({
  //   model: app.Answer,
  //   localStorage: new Store("backbone-answers"),
  // });

  // // instance of the Collection
  // app.answerList = new app.AnswerList();

  // // app.answerList.on('add change', function(){
  // //   console.log(JSON.stringify(app.answerList));
  // // });

  // app.AnswerView = Backbone.View.extend({
  //   tagName: 'tr',
  //   className: 'answer',
  //   template: _.template($('#answer-template').html()),

  //   events: {
  //     'click button.destroy': 'destroy',
  //     'change input.answer-edit' : 'updateLabel',
  //     'click button.edit' : 'editLabel',
  //     'click button.save' : 'saveLabel',
  //     'change input.toggle': 'toggleAnswer',      
  //   },

  //   initialize: function(){
  //     _.bindAll(this, 'render','remove', 'unrender', 'updateLabel', 'editLabel', 'saveLabel','toggleAnswer');
  //     this.model.bind('change', this.render);
  //     this.model.bind('destroy', this.unrender);
  //     this.render();
  //   },
  //   render: function(){
  //     $(this.el).html(this.template(
  //       {
  //         title: this.model.get('title'), 
  //         isAnswer: this.model.get('isAnswer'), 
  //         number: this.model.get('number')
  //       }
  //     ));

  //     $(this.el).find('.answer-edit').hide();
  //     $(this.el).find('.save').hide();

  //     return this;
  //   },
  //   unrender: function(){
  //     // console.log('unrender');
  //     $(this.el).remove();
  //   },
  //   destroy: function(){
  //     // console.log('destroy');
  //     this.model.destroy();
  //   },
  //   editLabel: function(e){
  //     $(e.target).hide();
  //     $(this.el).find('.save').show();
  //     $(this.el).find('.answer-text').hide();
  //     $(this.el).find('.answer-edit').show();
  //   },
  //   updateLabel: function(e){
  //     var newText = $(e.target).val();
  //     this.model.set({title: newText});
  //   },
  //   saveLabel: function(e){
  //     $(e.target).hide();
  //     $(this.el).find('.edit').show();
  //     $(this.el).find('.answer-edit').hide();
  //     $(this.el).find('.answer-text').show();
  //   },
  //   toggleAnswer: function(e){
  //     var all = app.answerList.where({isAnswer:true});

  //     _.each(all, function(item){
  //       item.set({isAnswer:false});
  //     });

  //     if($(e.target).val() == 'on'){
  //       // console.log($(e.target).val());
  //       this.model.set({ isAnswer: true });
  //     } else {
  //       this.model.set({ isAnswer: false });
  //     }
  //   }
  // });


  // app.AppView = Backbone.View.extend({
  //   el: $('#body'),

  //   events: {
  //     'click button#insert-button': 'addAnswer',
  //     'click button#get-answer': 'getAnswer',
  //   },

  //   initialize: function(){
  //     _.bindAll(this, 'addAnswer', 'getAnswer');

  //     this.collection = new app.AnswerList();
  //     this.counter = 0;
  //   },
  //   addAnswer: function(){
  //     this.counter++;
  //     var answer = new app.Answer();
  //     answer.set({
  //       number: this.counter
  //     });

  //     app.answerList.add(answer);

  //     var newAnswer = new app.AnswerView({model: answer});

  //     $('tbody',this.el).append(newAnswer.render().el);
  //   },
  //   getAnswer: function(){
  //     var theAnswer = app.answerList.where({isAnswer: true});
  //     var answr = {};
  //     _.each(theAnswer, function(item){
  //       answr = item.toJSON();
  //     });
  //     alert(answr.title);
  //   }

  // });

  // app.appView = new app.AppView();


  // // view para dar output na collection
  // app.Output = Backbone.View.extend({
  //   el: '#output',

  //   initialize: function(){
  //     // this.model.bind('collectionChange', this.render);
  //     _.bindAll(this,'render');
  //     app.answerList.bind('add change destroy', this.render);
  //     this.render();
  //   },
  //   render: function(){
  //     var string = JSON.stringify(app.answerList, null, 2);
  //     this.$el.html('<pre><code>'+ string + '</code></pre>');
  //   }

  // });

  // app.output = new app.Output();

});
