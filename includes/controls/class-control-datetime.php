<?php
/**
 * Datetime control class.  This class is meant for storing a datetime in the format
 * of `YYYY-MM-DD HH:MM:SS` or `0000-00-00 00:00:00`.  You can set the `$show_time`
 * property to `false`.
 *
 * Note that this control should be used in conjunction with the `datetime` setting
 * type or another custom class that can handle the datetime.
 *
 * @package Metabox
 */

namespace NineCodes\Metabox;

/**
 * Datetime control class.
 *
 * @since  0.1.0
 */
class Control_Datetime extends Control {

	/**
	 * The type of control.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    string
	 */
	public $type = 'datetime';

	/**
	 * Whether to show the time.  Note that settings, particularly the
	 * `Setting_Date` class will store the time as `00:00:00` if
	 * no time is provided.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    bool
	 */
	public $show_time = true;

	/**
	 * Adds custom data to the json array. This data is passed to the Underscore template.
	 *
	 * @since  0.1.0
	 * @access public
	 *
	 * @return void
	 */
	public function to_json() {
		global $wp_locale;

		parent::to_json();

		$this->json['show_time'] = $this->show_time;

		$field_name = $this->get_field_name();

		// Get project start/end dates.
		$date = $this->get_value();

		// Get the year, month, and day.
		$year  = $date ? mysql2date( 'Y', $date, false ) : '';
		$month = $date ? mysql2date( 'm', $date, false ) : '';
		$day   = $date ? mysql2date( 'd', $date, false ) : '';

		// Get the hour, minute, and second.
		$hour   = $date ? mysql2date( 'H', $date, false ) : '';
		$minute = $date ? mysql2date( 'i', $date, false ) : '';
		$second = $date ? mysql2date( 's', $date, false ) : '';

		// Year.
		$this->json['year'] = array(
			'value' => esc_attr( $year ),
			'label' => esc_html__( 'Year', 'ninecodes_metabox' ),
			'name'  => esc_attr( "{$field_name}_year" ),
			'attr'  => sprintf( 'placeholder="%s" size="4" maxlength="4" autocomplete="off"', esc_attr( date_i18n( 'Y' ) ) ),
		);

		// Month.
		$this->json['month'] = array(
			'value'   => esc_attr( $month ),
			'name'    => esc_attr( "{$field_name}_month" ),
			'label'   => esc_html__( 'Month', 'ninecodes_metabox' ),
			'choices' => array(
				array(
					'num'   => '',
					'label' => '',
				),
			),
		);

		for ( $i = 1; $i < 13; $i++ ) {

			$monthnum  = zeroise( $i, 2 );
			$monthtext = $wp_locale->get_month_abbrev( $wp_locale->get_month( $i ) );

			$this->json['month']['choices'][] = array(
				'num'   => $monthnum,
				'label' => $monthtext,
			);
		}

		// Day.
		$this->json['day'] = array(
			'value' => esc_attr( $day ),
			'name'  => esc_attr( "{$field_name}_day" ),
			'label' => esc_html__( 'Day', 'ninecodes_metabox' ),
			'attr'  => sprintf( 'placeholder="%s" size="2" maxlength="2" autocomplete="off"', esc_attr( date_i18n( 'd' ) ) ),
		);

		// Hour.
		$this->json['hour'] = array(
			'value' => esc_attr( $hour ),
			'name'  => esc_attr( "{$field_name}_hour" ),
			'label' => esc_html__( 'Hour', 'ninecodes_metabox' ),
			'attr'  => 'placeholder="00" size="2" maxlength="2" autocomplete="off"',
		);

		// Minute.
		$this->json['minute'] = array(
			'value' => esc_attr( $minute ),
			'name'  => esc_attr( "{$field_name}_minute" ),
			'label' => esc_html__( 'Minute', 'ninecodes_metabox' ),
			'attr'  => 'placeholder="00" size="2" maxlength="2" autocomplete="off"',
		);

		// Second.
		$this->json['second'] = array(
			'value' => esc_attr( $second ),
			'name'  => esc_attr( "{$field_name}_second" ),
			'label' => esc_html__( 'Second', 'ninecodes_metabox' ),
			'attr'  => 'placeholder="00" size="2" maxlength="2" autocomplete="off"',
		);
	}
}
