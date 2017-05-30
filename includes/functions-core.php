<?php
/**
 * Helper functions.
 *
 * @package Metabox
 */

namespace NineCodes\Metabox;

/**
 * Sanitize a boolean
 *
 * Function for validating booleans before saving them as metadata. If the value is
 * `true`, we'll return a `1` to be stored as the meta value.  Else, we return `false`.
 *
 * @since 0.1.0
 * @access public
 * @param mixed $value Unvalidated value.
 * @return bool|int
 */
function validate_boolean( $value ) {
	return wp_validate_boolean( $value ) ? 1 : false;
}

/**
 * Gets Underscore.js templates for managers
 *
 * @since 0.1.0
 * @param string $slug Template part slug.
 *
 * @return void
 */
function get_manager_template( $slug = '' ) {
	get_template( 'manager', $slug );
}

/**
 * Gets Underscore.js templates for navs
 *
 * @since 0.1.0
 * @param string $slug Template part slug.
 *
 * @return void
 */
function get_nav_template( $slug = '' ) {
	get_template( 'nav', $slug );
}

/**
 * Gets Underscore.js templates for sections
 *
 * @since 0.1.0
 * @param string $slug Template part slug.
 *
 * @return void
 */
function get_section_template( $slug = '' ) {
	get_template( 'section', $slug );
}

/**
 * Gets Underscore.js templates for controls
 *
 * @since 0.1.0
 * @param string $slug Template part slug.
 *
 * @return void
 */
function get_control_template( $slug = '' ) {
	get_template( 'control', $slug );
}

/**
 * Helper function for getting Underscore.js templates
 *
 * @since 0.1.0
 * @param string $name The name of the specialised template.
 * @param string $slug The slug name for the generic template.
 *
 * @return void
 */
function get_template( $name, $slug = '' ) {

	// Allow devs to hook in early to bypass template checking.
	$located = apply_filters( "ninecodes_metabox_pre_{$name}_template", '', $slug );

	// If there's no template, let's try to find one.
	if ( ! $located ) {

		$templates = array();

		if ( $slug ) {
			$templates[] = "{$name}-{$slug}.php";
		}

		$templates[] = "{$name}.php";

		// Allow devs to filter the template hierarchy.
		$templates = apply_filters( "ninecodes_metabox_{$name}_template_hierarchy", $templates, $slug );

		// Loop through the templates and locate one.
		foreach ( $templates as $template ) {

			if ( file_exists( \NineCodes\Metabox\ninecodes_metabox()->path_tmpl . $template ) ) {
				$located = \NineCodes\Metabox\ninecodes_metabox()->path_tmpl . $template;
				break;
			}
		}
	}

	// Allow devs to filter the final template.
	$located = apply_filters( "ninecodes_metabox_{$name}_template", $located, $slug );

	// Load the template.
	if ( $located ) {
		require( $located );
	}
}
