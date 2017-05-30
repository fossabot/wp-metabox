<?php
/**
 * Post parent control class.  This class is a specialty class meant for use in unique
 * scenarios where you're not using the core post parent drop-down. This is often the
 * case with flat post types that have a parent post.  This control is not meant to be
 * used with a setting. Core WP will store the data in the `post.post_parent` field.
 *
 * @package Metabox
 */

namespace NineCodes\Metabox;

/**
 * Post parent control class.
 *
 * @since  0.1.0
 * @access public
 */
class Control_Parent extends Control {

	/**
	 * The type of control.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    string
	 */
	public $type = 'parent';

	/**
	 * The post type to select posts from.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    string
	 */
	public $post_type = '';

	/**
	 * Returns the HTML field name for the control.
	 *
	 * @since 0.1.0
	 * @access public
	 * @param string $setting The setting name.
	 * @return array
	 */
	public function get_field_name( $setting = 'default' ) {

		return 'post_parent';
	}

	/**
	 * Get the value for the setting.
	 *
	 * @since 0.1.0
	 * @access public
	 * @param string $setting The setting name.
	 * @return mixed
	 */
	public function get_value( $setting = 'default' ) {

		return get_post( $this->manager->post_id )->post_parent;
	}

	/**
	 * Adds custom data to the json array. This data is passed to the Underscore template.
	 *
	 * @since  0.1.0
	 * @access public
	 * @return void
	 */
	public function to_json() {
		parent::to_json();

		$_post = get_post( $this->manager->post_id );

		$posts = get_posts(
			array(
				'post_type'      => $this->post_type ? $this->post_type : get_post_type( $this->manager->post_id ),
				'post_status'    => 'any',
				'post__not_in'   => array( $this->manager->post_id ),
				'posts_per_page' => -1,
				'post_parent'    => 0,
				'orderby'        => 'title',
				'order'          => 'ASC',
				'fields'         => array( 'ID', 'post_title' ),
			)
		);

		$this->json['choices'] = array(
			array(
				'value' => 0,
				'label' => '',
			),
		);

		foreach ( $posts as $post ) {
			$this->json['choices'][] = array(
				'value' => $post->ID,
				'label' => $post->post_title,
			);
		}
	}
}
