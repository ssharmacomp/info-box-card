<?php
/**
 * Plugin Name: Info Box Card
 * Description: A Gutenberg Info Box block with icon or image media, title, description, and CTA controls.
 * Version: 1.0.0
 * Author: Tech Fusion
 * Requires at least: 6.1
 * Requires PHP: 7.4
 * Text Domain: info-box-card
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function info_box_card_enqueue_font_awesome() {
	wp_enqueue_style(
		'info-box-card-font-awesome',
		'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
		array(),
		'4.7.0'
	);
}

function info_box_card_register_block() {
	wp_register_script(
		'info-box-card-editor-script',
		plugins_url( 'blocks/info-box/index.js', __FILE__ ),
		array(
			'wp-blocks',
			'wp-block-editor',
			'wp-components',
			'wp-element',
			'wp-i18n'
		),
		filemtime( __DIR__ . '/blocks/info-box/index.js' ),
		true
	);

	wp_register_style(
		'info-box-card-style',
		plugins_url( 'blocks/info-box/style.css', __FILE__ ),
		array(),
		filemtime( __DIR__ . '/blocks/info-box/style.css' )
	);

	wp_register_style(
		'info-box-card-editor-style',
		plugins_url( 'blocks/info-box/editor.css', __FILE__ ),
		array( 'wp-edit-blocks' ),
		filemtime( __DIR__ . '/blocks/info-box/editor.css' )
	);

	register_block_type( __DIR__ . '/blocks/info-box' );
}

add_action( 'init', 'info_box_card_register_block' );
add_action( 'enqueue_block_assets', 'info_box_card_enqueue_font_awesome' );
