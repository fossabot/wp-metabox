<?php
/**
 * Plugin Name: Metabox
 * Plugin URI: https://github.com/ninecodes/metabox
 * Description: A neat little post meta framework
 * Version: 0.1.0-alpha.1
 * Author: NineCodes
 * Author URI: https://github.com/ninecodes
 *
 * Requires at least: 4.7
 * Tested up to: 4.7.4
 *
 * Text Domain: ninecodes-metabox
 * Domain Path: /languages
 *
 * Copyright (c) 2017 NineCodes (https://ninecodes.com/)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * @package Metabox
 */

namespace NineCodes\Metabox;

if ( ! function_exists( __NAMESPACE__ . '\\ninecodes_metabox' ) ) :

	/**
	 * Init function
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @return Metabox
	 */
	function ninecodes_metabox() {

		static $plugin;

		if ( is_null( $plugin ) ) {
			$plugin = new Plugin();
		}

		return $plugin;
	}

	add_action( 'admin_init', function() {

		global $wp_version;

		if ( ! defined( 'WP_METABOX_API_LOADED' ) && version_compare( $wp_version, '4.7', '>=' ) ) {

			define( 'WP_METABOX_API_LOADED', true );

			$path_dir = plugin_dir_path( __FILE__ );

			// Load base classes.
			require_once( $path_dir . 'includes/class-metabox.php' );
			require_once( $path_dir . 'includes/class-section.php' );
			require_once( $path_dir . 'includes/class-control.php' );
			require_once( $path_dir . 'includes/class-setting.php' );
			require_once( $path_dir . 'includes/class-plugin.php' );

			// Load functions.
			require_once( $path_dir . 'includes/functions-core.php' );

			ninecodes_metabox();
		}
	}, 900 );

endif;
