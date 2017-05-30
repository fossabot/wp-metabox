<?php
/**
 * Plugin Name: Metabox
 * Plugin URI: https://github.com/ninecodes/metabox
 * Description: A little post meta framework.
 * Version: 0.1.0
 * Author: NineCodes
 * Author URI: https://github.com/ninecodes
 *
 * Requires at least: 4.7
 * Tested up to: 4.7.3
 *
 * Text Domain: ninecodes-social-manager
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
			$plugin = new Metabox();
		}

		return $plugin;
	}

	add_action( 'init', function() {

		global $wp_version;

		if ( ! defined( 'WP_METABOX_API_LOADED' ) && version_compare( $wp_version, '4.7', '>=' ) ) {
			define( 'WP_METABOX_API_LOADED', true );

			require_once( plugin_dir_path( __FILE__ ) . 'includes/class-metabox.php' );
			ninecodes_metabox();
		}
	} );
endif;
