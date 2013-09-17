<?php
/**
 * Plugin Name: CEUX-Content Blocks
 * Plugin URI: https://github.com/imageinabox/wp-contentblocks-prototype
 * Description: My personal prototyping repo for help developing Content Blocks feature for Wordpress-UI group
 * Version: 0.1
 * Author: Image In A Box
 * Author URI: http://www.imageinabox.com/
 * License: A "Slug" license name e.g. GPL2
 */

if( ! class_exists( 'WPCEUXContentBlocks' ) ) {
	class WPCEUXContentBlocks {
		var $page;
		
		public function __construct() {  
			
			wp_register_script( 'ceux-etch-js' , plugins_url( '/js/etch.js' , __FILE__ ) , array( 'jquery' , 'json2' , 'underscore' , 'backbone' , 'jquery-ui' ) , '1' , true );
			wp_register_script( 'ceux-main-js' , plugins_url( '/js/main.js' , __FILE__ ) , array( 'etch' ) , true );
			wp_register_style( 'ceux-etch-css', plugins_url( '/css/etch.css' , __FILE__ ) );
			wp_register_style( 'ceux-style-css', plugins_url( '/css/style.css' , __FILE__ ) );
			
			add_action( 'admin_menu' , array( $this , 'addMenu' ) );
		}  
		
		public function addMenu() {
			$this->page = add_posts_page( __( 'Add new (Prototype)' ) , __( 'Add new (Prototype)' ) , 'read' , 'add-new-prototype-page' , array( $this , 'displayPage' ) );
			add_action( 'admin_print_styles' , array( $this , 'displayStyles' ) );
			add_action( 'admin_print_scripts' , array( $this , 'displayScripts' ) );
		}
		
		public function displayStyles() {
			wp_enqueue_style( 'ceux-etch-css' );
			wp_enqueue_style( 'ceux-style-css' );
		}
		public function displayScripts() {
			wp_enqueue_script( 'ceux-etch-js' );
			wp_enqueue_script( 'ceux-main-js' );
		}
		
		public function displayPage() {
			?>
			<section id="post">
				<section id="contentbox">
					<h2>Add New Post <?php echo $this->page; ?></h2>

					<div id="container">
						<div id="content">
						<div id="content-blocks"></div>        
						</div>

						<a href="#" id="add-block"><span class="dashicons dashicons-plus-small"></span>Add Content</a>
						<div id="blocksSelect"><span class="arrow-left"></span></div>
					</div>

				</section>

				<!-- metaboxes (sidebar) -->
				<aside id="metabox">
					<div class="postbox">
						<div class="handlediv" title=""></div>
						<h3 class="hndle"><span>Publish</span></h3>
						<div class="inside">
							<p>Here comes the defaults from post publishing.</p>
							<button id="save-button" class="button button-large button-primary">Publish</button>
						</div>
					</div>
				</aside>
			</section>
			<script type="text/template" id="post-template">
				<input type="text" name="post_title" id="post-title" value="" placeholder="<%= post_title %>">
				<div id="the-permalink" class="light"><strong>Permalink: </strong>http://yoursite.com/<input type="text" name="post_permalink" id="post-permalink" value="<%= post_permalink %>"><span id="permalink-text"><%= post_permalink %></span><button id="permalink-edit" class="button button-small">Edit</button></div>
			</script>

			<script type="text/template" id="blocks-template">
				<div class="customBlock" data-type="<%= objType %>"><span class="block-image dashicons <%= icon %>"></span><%= name %></div>	
			</script>

			<!-- templates for every content block -->
			<!-- text -->
			<script type="text/template" id="wp-text">
				<div class="ctrlbar">
					<% if(remove){ %> <span class="dashicons dashicons-no remove"></span> <% } %>
					<% if(move){ %> <span class="dashicons dashicons-menu move"></span> <% } %>
				</div>
				<<%= block_tag %> class="wp-block <%= block_type %> editable" data-button-class="all">
					<%= block_content %>
				</% block_tag %>
			</script>

			<!-- image -->
			<script type="text/template" id="wp-image">
				<div class="ctrlbar">
					<% if(remove){ %> <span class="dashicons dashicons-no remove"></span> <% } %>
					<% if(move){ %> <span class="dashicons dashicons-menu move"></span> <% } %>
				</div>
				<<%= block_tag %> class="wp-block <%= block_type %>">
					<h2>Add an Image</h2>
					<p>Drop here an image or click the button to upload.</p>
					<p><button class="button button-primary button-xlarge">Upload Image</button>
				</% block_tag %>   
			</script>

			<!-- gallery -->
			<script type="text/template" id="wp-gallery">
				<div class="ctrlbar">
					<% if(remove){ %> <span class="dashicons dashicons-no remove"></span> <% } %>
					<% if(move){ %> <span class="dashicons dashicons-menu move"></span> <% } %>
				</div>
				<<%= block_tag %> class="wp-block <%= block_type %>">
					<h2>Add a Gallery</h2>
					<p>Drop here your images or click the button to upload.</p>
					<p><button class="button button-primary button-xlarge">Upload Images</button>
				</% block_tag %>   
			</script>

			<!-- audio -->
			<script type="text/template" id="wp-audio">
				<div class="ctrlbar">
					<% if(remove){ %> <span class="dashicons dashicons-no remove"></span> <% } %>
					<% if(move){ %> <span class="dashicons dashicons-menu move"></span> <% } %>
				</div>
				<<%= block_tag %> class="wp-block <%= block_type %>">
					<h2>Add an Audio File</h2>
					<p>Drop here your file or click the button to upload.</p>
					<p><button class="button button-primary button-xlarge">Upload Audio</button>
				</% block_tag %>   
			</script>

			<!-- video -->
			<script type="text/template" id="wp-video">
				<div class="ctrlbar">
					<% if(remove){ %> <span class="dashicons dashicons-no remove"></span> <% } %>
					<% if(move){ %> <span class="dashicons dashicons-menu move"></span> <% } %>
				</div>
				<<%= block_tag %> class="wp-block <%= block_type %>">
					<h2>Add a Video File</h2>
					<p>Drop here your file or click the button to upload.</p>
					<p><button class="button button-primary button-xlarge">Upload Video</button>
				</% block_tag %>   
			</script>

			<!-- code -->
			<script type="text/template" id="wp-code">
				<div class="ctrlbar">
					<% if(remove){ %> <span class="dashicons dashicons-no remove"></span> <% } %>
					<% if(move){ %> <span class="dashicons dashicons-menu move"></span> <% } %>
				</div>
				<<%= block_tag %> class="wp-block <%= block_type %>">
					<pre><code class="editable"><%= block_content %></pre></code>
				</% block_tag %>
			</script>

			<!-- code -->
			<script type="text/template" id="wp-tweet">
				<div class="ctrlbar">
					<% if(remove){ %> <span class="dashicons dashicons-no remove"></span> <% } %>
					<% if(move){ %> <span class="dashicons dashicons-menu move"></span> <% } %>
				</div>
				<<%= block_tag %> class="<%= block_type %>">
					<h2><span class="title-image dashicons dashicons-twitter1"></span>Insert your tweet url</h2>
					<input type="text" class="input" value="<%= block_content %>">
				</% block_tag %>
			</script>

			<!-- quote -->
			<script type="text/template" id="wp-quote">
				<div class="ctrlbar">
					<% if(remove){ %> <span class="dashicons dashicons-no remove"></span> <% } %>
					<% if(move){ %> <span class="dashicons dashicons-menu move"></span> <% } %>
				</div>
				<<%= block_tag %> class="<%= block_type %>">
					<h2><span class="title-image dashicons dashicons-format-quote"></span>Insert your quote here</h2>
					<input type="text" class="input" value="<%= block_content %>">
				</% block_tag %>
			</script>

			<!-- embed -->
			<script type="text/template" id="wp-embed">
				<div class="ctrlbar">
					<% if(remove){ %> <span class="dashicons dashicons-no remove"></span> <% } %>
					<% if(move){ %> <span class="dashicons dashicons-menu move"></span> <% } %>
				</div>
				<<%= block_tag %> class="<%= block_type %>">
					<h2><span class="title-image dashicons dashicons-welcome-add-page"></span>Insert your embed code here</h2>
					<textarea class="input"><%= block_content %></textarea>
				</% block_tag %>
			</script>
			<?php
		}
	}

	function add_in_wp_content_blocks() {
		$WPCEUXContentBlocks = new WPCEUXContentBlocks();
	}
	add_action( 'init' , 'add_in_wp_content_blocks' );
}
?>