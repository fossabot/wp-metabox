<?php
/**
 * Image control class.  This control allows users to set an image.  It passes the attachment
 * ID the setting, so you'll need a custom control class if you want to store anything else,
 * such as the URL or other data.
 *
 * @package Metabox\Control
 */

namespace NineCodes\Metabox;

/**
 * Image control class.
 *
 * @since  0.1.0
 * @access public
 */
class Control_Image extends Control {

	/**
	 * The type of control.
	 *
	 * @since 0.1.0
	 * @access public
	 * @var string
	 */
	public $type = 'image';

	/**
	 * Array of text labels to use for the media upload frame.
	 *
	 * @since 0.1.0
	 * @access public
	 * @var string
	 */
	public $l10n = array();

	/**
	 * Image size to display.  If the size isn't found for the image,
	 * the full size of the image will be output.
	 *
	 * @since 0.1.0
	 * @access public
	 * @var string
	 */
	public $size = 'large';

	/**
	 * Creates a new control object.
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @param object $manager  The metabox Object.
	 * @param string $name The control name.
	 * @param array  $args The control arguments.
	 * @return void
	 */
	public function __construct( $manager, $name, $args = array() ) {
		parent::__construct( $manager, $name, $args );

		$this->l10n = wp_parse_args(
			$this->l10n,
			array(
				'upload' => __( 'Add image', 'ninecodes-metabox' ),
				'set' => __( 'Set as image', 'ninecodes-metabox' ),
				'choose' => __( 'Choose image', 'ninecodes-metabox' ),
				'change' => __( 'Change image', 'ninecodes-metabox' ),
				'remove' => __( 'Remove image', 'ninecodes-metabox' ),
				'placeholder' => __( 'No image selected', 'ninecodes-metabox' ),
			)
		);
	}

	/**
	 * Enqueue scripts/styles for the control.
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @return void
	 */
	public function enqueue() {

		wp_enqueue_script( 'media-views' );
	}

	/**
	 * Adds custom data to the json array.
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @return void
	 */
	public function to_json() {
		parent::to_json();

		$this->json['l10n'] = $this->l10n;
		$this->json['size'] = $this->size;

		$value = $this->get_value();

		$alt = '';
		$image = $alt;

		if ( $value ) {
			$image = wp_get_attachment_image_src( absint( $value ), $this->size );
			$alt   = get_post_meta( absint( $value ), '_wp_attachment_image_alt', true );
		}

		$this->json['src'] = $image ? esc_url( $image[0] ) : '';
		$this->json['alt'] = $alt   ? esc_attr( $alt )     : '';
	}
}
