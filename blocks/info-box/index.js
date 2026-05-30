( function( wp ) {
	const { registerBlockType } = wp.blocks;
	const { __ } = wp.i18n;
	const {
		InspectorControls,
		MediaUpload,
		MediaUploadCheck,
		RichText,
		URLInputButton,
		useBlockProps
	} = wp.blockEditor;
	const {
		BaseControl,
		Button,
		ColorPalette,
		PanelBody,
		SelectControl,
		TabPanel,
		TextControl,
		ToggleControl
	} = wp.components;
	const { Fragment, createElement: el } = wp.element;

	const FA_ICONS = [
		'fa-adjust', 'fa-anchor', 'fa-archive', 'fa-area-chart', 'fa-arrows', 'fa-bell', 'fa-bolt', 'fa-briefcase',
		'fa-bullhorn', 'fa-calendar', 'fa-camera', 'fa-car', 'fa-check', 'fa-check-circle', 'fa-cloud', 'fa-code',
		'fa-cog', 'fa-comment', 'fa-compass', 'fa-credit-card', 'fa-diamond', 'fa-download', 'fa-envelope',
		'fa-external-link', 'fa-eye', 'fa-female', 'fa-file-text', 'fa-film', 'fa-fire', 'fa-flag', 'fa-flask',
		'fa-gift', 'fa-globe', 'fa-graduation-cap', 'fa-heart', 'fa-home', 'fa-image', 'fa-info', 'fa-key',
		'fa-laptop', 'fa-leaf', 'fa-life-ring', 'fa-lightbulb-o', 'fa-line-chart', 'fa-lock', 'fa-magic', 'fa-map-marker',
		'fa-mobile', 'fa-money', 'fa-paper-plane', 'fa-phone', 'fa-plane', 'fa-plug', 'fa-rocket', 'fa-search',
		'fa-send', 'fa-shield', 'fa-shopping-bag', 'fa-star', 'fa-support', 'fa-tag', 'fa-thumbs-up', 'fa-trophy',
		'fa-truck', 'fa-university', 'fa-user', 'fa-users', 'fa-wifi', 'fa-wrench'
	];

	const TITLE_TAG_OPTIONS = [
		{ label: 'H1', value: 'h1' },
		{ label: 'H2', value: 'h2' },
		{ label: 'H3', value: 'h3' },
		{ label: 'H4', value: 'h4' },
		{ label: 'H5', value: 'h5' },
		{ label: 'H6', value: 'h6' },
		{ label: 'Div', value: 'div' },
		{ label: 'Paragraph', value: 'p' }
	];

	const FONT_WEIGHT_OPTIONS = [
		{ label: '400', value: '400' },
		{ label: '500', value: '500' },
		{ label: '600', value: '600' },
		{ label: '700', value: '700' },
		{ label: '800', value: '800' }
	];

	const MEDIA_TYPE_OPTIONS = [
		{ label: __( 'Icon', 'info-box-card' ), value: 'icon' },
		{ label: __( 'Image', 'info-box-card' ), value: 'image' }
	];

	const MEDIA_STYLE_OPTIONS = [
		{ label: __( 'Stacked', 'info-box-card' ), value: 'stacked' },
		{ label: __( 'Framed', 'info-box-card' ), value: 'framed' }
	];

	const ALIGNMENT_OPTIONS = [
		{ label: __( 'Left', 'info-box-card' ), value: 'left' },
		{ label: __( 'Center', 'info-box-card' ), value: 'center' },
		{ label: __( 'Right', 'info-box-card' ), value: 'right' }
	];

	const ICON_SIZE_OPTIONS = [
		{ label: __( 'Extra Small', 'info-box-card' ), value: '20px' },
		{ label: __( 'Small', 'info-box-card' ), value: '28px' },
		{ label: __( 'Medium', 'info-box-card' ), value: '36px' },
		{ label: __( 'Large', 'info-box-card' ), value: '48px' },
		{ label: __( 'Extra Large', 'info-box-card' ), value: '64px' }
	];

	const COLOR_OPTIONS = [
		{ name: 'Ink', color: '#111111' },
		{ name: 'Slate', color: '#5b6470' },
		{ name: 'Blue', color: '#2271b1' },
		{ name: 'Coral', color: '#ff6f61' },
		{ name: 'Emerald', color: '#1f9d78' }
	];

	function marginStyle( top, right, bottom, left ) {
		return [ top || '0px', right || '0px', bottom || '0px', left || '0px' ].join( ' ' );
	}

	function renderMarginControls( label, values, setAttributes ) {
		return el(
			BaseControl,
			{ label: label, className: 'sib-info-box__margin-control' },
			el( TextControl, {
				label: __( 'Top', 'info-box-card' ),
				value: values.top,
				onChange: function( value ) {
					setAttributes( values.topKey( value ) );
				}
			} ),
			el( TextControl, {
				label: __( 'Right', 'info-box-card' ),
				value: values.right,
				onChange: function( value ) {
					setAttributes( values.rightKey( value ) );
				}
			} ),
			el( TextControl, {
				label: __( 'Bottom', 'info-box-card' ),
				value: values.bottom,
				onChange: function( value ) {
					setAttributes( values.bottomKey( value ) );
				}
			} ),
			el( TextControl, {
				label: __( 'Left', 'info-box-card' ),
				value: values.left,
				onChange: function( value ) {
					setAttributes( values.leftKey( value ) );
				}
			} )
		);
	}

	registerBlockType( 'info-box-card/info-box', {
		edit: function Edit( props ) {
			const { attributes, setAttributes } = props;
			const {
				showMedia,
				mediaType,
				selectedIcon,
				iconSearch,
				imageUrl,
				imageAlt,
				imageId,
				showTitle,
				titleTag,
				titleText,
				showDescription,
				descriptionText,
				showButton,
				cardAlignment,
				buttonText,
				buttonUrl,
				mediaStyle,
				mediaBorderRadius,
				mediaBackgroundColor,
				iconColor,
				iconFontSize,
				imageWidth,
				imageHeight,
				titleColor,
				titleFontSize,
				titleFontWeight,
				titleMarginTop,
				titleMarginRight,
				titleMarginBottom,
				titleMarginLeft,
				descriptionColor,
				descriptionMarginTop,
				descriptionMarginRight,
				descriptionMarginBottom,
				descriptionMarginLeft
			} = attributes;

			const filteredIcons = FA_ICONS.filter( function( icon ) {
				return ! iconSearch || icon.indexOf( iconSearch.toLowerCase() ) !== -1;
			} );

			const blockProps = useBlockProps( {
				className:
					'sib-info-box is-style-' +
					mediaStyle +
					' is-media-' +
					mediaType +
					' is-align-' +
					cardAlignment
			} );

			const titleStyle = {
				color: titleColor,
				fontSize: titleFontSize || '1.5rem',
				fontWeight: titleFontWeight,
				margin: marginStyle( titleMarginTop, titleMarginRight, titleMarginBottom, titleMarginLeft )
			};

			const mediaStyleObject = {
				borderRadius: mediaBorderRadius || '999px',
				width: imageWidth || '96px',
				height: imageHeight || '96px',
				backgroundColor: mediaBackgroundColor || '#e8f1fb'
			};

			const descriptionStyle = {
				color: descriptionColor,
				margin: marginStyle(
					descriptionMarginTop,
					descriptionMarginRight,
					descriptionMarginBottom,
					descriptionMarginLeft
				)
			};

			const mediaNode = ! showMedia
				? null
				: mediaType === 'image'
						? imageUrl
						? el(
								'figure',
								{
									className: 'sib-info-box__figure',
									style: mediaStyleObject
								},
								el( 'img', {
									src: imageUrl,
									alt: imageAlt || '',
									className: 'sib-info-box__image',
									style: {
										borderRadius: mediaBorderRadius || '999px'
									}
								} )
						  )
						: el(
								'div',
								{
									className: 'sib-info-box__media-placeholder',
									style: mediaStyleObject
								},
								__( 'Choose an image from the sidebar.', 'info-box-card' )
						  )
					: el(
							'span',
							{
								className: 'sib-info-box__icon',
								style: Object.assign( {}, mediaStyleObject, {
									color: iconColor || '#2271b1',
									fontSize: iconFontSize || '36px'
								} )
							},
							el( 'i', { className: 'fa ' + selectedIcon, 'aria-hidden': 'true' } )
					  );

			return el(
				Fragment,
				null,
				el(
					InspectorControls,
					null,
					el(
						TabPanel,
						{
							className: 'sib-info-box__tabs',
							activeClass: 'is-active',
							tabs: [
								{ name: 'general', title: __( 'General', 'info-box-card' ) },
								{ name: 'style', title: __( 'Style', 'info-box-card' ) }
							]
						},
						function( tab ) {
							if ( tab.name === 'style' ) {
								return el(
									Fragment,
									null,
									el(
										PanelBody,
										{
											title: __( 'Image / Icon', 'info-box-card' ),
											initialOpen: true
										},
										el( SelectControl, {
											label: __( 'Style', 'info-box-card' ),
											value: mediaStyle,
											options: MEDIA_STYLE_OPTIONS,
											onChange: function( value ) {
												setAttributes( { mediaStyle: value } );
											}
										} ),
										el( TextControl, {
											label: __( 'Border radius', 'info-box-card' ),
											help: __( 'Example: 20px, 50%, 999px', 'info-box-card' ),
											value: mediaBorderRadius,
											onChange: function( value ) {
												setAttributes( { mediaBorderRadius: value || '999px' } );
											}
										} ),
										el( 'p', { className: 'components-base-control__label' }, __( 'Background color', 'info-box-card' ) ),
										el( ColorPalette, {
											colors: COLOR_OPTIONS,
											value: mediaBackgroundColor,
											onChange: function( value ) {
												setAttributes( { mediaBackgroundColor: value || '#e8f1fb' } );
											}
										} ),
										el( TextControl, {
											label: __( 'Image width', 'info-box-card' ),
											help: __( 'Example: 96px, 120px, 8rem', 'info-box-card' ),
											value: imageWidth,
											onChange: function( value ) {
												setAttributes( { imageWidth: value || '96px' } );
											}
										} ),
										el( TextControl, {
											label: __( 'Image height', 'info-box-card' ),
											help: __( 'Example: 96px, 120px, 8rem', 'info-box-card' ),
											value: imageHeight,
											onChange: function( value ) {
												setAttributes( { imageHeight: value || '96px' } );
											}
										} ),
										el( 'p', { className: 'components-base-control__label' }, __( 'Icon color', 'info-box-card' ) ),
										el( ColorPalette, {
											colors: COLOR_OPTIONS,
											value: iconColor,
											onChange: function( value ) {
												setAttributes( { iconColor: value || '#2271b1' } );
											}
										} ),
										el( SelectControl, {
											label: __( 'Icon size', 'info-box-card' ),
											value: iconFontSize,
											options: ICON_SIZE_OPTIONS,
											onChange: function( value ) {
												setAttributes( { iconFontSize: value || '36px' } );
											}
										} )
									),
									el(
										PanelBody,
										{
											title: __( 'Title', 'info-box-card' ),
											initialOpen: false
										},
										el( 'p', { className: 'components-base-control__label' }, __( 'Color', 'info-box-card' ) ),
										el( ColorPalette, {
											colors: COLOR_OPTIONS,
											value: titleColor,
											onChange: function( value ) {
												setAttributes( { titleColor: value || '#111111' } );
											}
										} ),
										el( SelectControl, {
											label: __( 'Font size', 'info-box-card' ),
											value: titleFontSize,
											options: [
												{ label: __( 'Small', 'info-box-card' ), value: '1.125rem' },
												{ label: __( 'Medium', 'info-box-card' ), value: '1.5rem' },
												{ label: __( 'Large', 'info-box-card' ), value: '1.875rem' },
												{ label: __( 'Extra Large', 'info-box-card' ), value: '2.25rem' }
											],
											onChange: function( value ) {
												setAttributes( { titleFontSize: value || '1.5rem' } );
											}
										} ),
										el( SelectControl, {
											label: __( 'Font weight', 'info-box-card' ),
											value: titleFontWeight,
											options: FONT_WEIGHT_OPTIONS,
											onChange: function( value ) {
												setAttributes( { titleFontWeight: value } );
											}
										} ),
										renderMarginControls(
											__( 'Margin', 'info-box-card' ),
											{
												top: titleMarginTop,
												right: titleMarginRight,
												bottom: titleMarginBottom,
												left: titleMarginLeft,
												topKey: function( value ) { return { titleMarginTop: value }; },
												rightKey: function( value ) { return { titleMarginRight: value }; },
												bottomKey: function( value ) { return { titleMarginBottom: value }; },
												leftKey: function( value ) { return { titleMarginLeft: value }; }
											},
											setAttributes
										)
									),
									el(
										PanelBody,
										{
											title: __( 'Description', 'info-box-card' ),
											initialOpen: false
										},
										el( 'p', { className: 'components-base-control__label' }, __( 'Color', 'info-box-card' ) ),
										el( ColorPalette, {
											colors: COLOR_OPTIONS,
											value: descriptionColor,
											onChange: function( value ) {
												setAttributes( { descriptionColor: value || '#5b6470' } );
											}
										} ),
										renderMarginControls(
											__( 'Margin', 'info-box-card' ),
											{
												top: descriptionMarginTop,
												right: descriptionMarginRight,
												bottom: descriptionMarginBottom,
												left: descriptionMarginLeft,
												topKey: function( value ) { return { descriptionMarginTop: value }; },
												rightKey: function( value ) { return { descriptionMarginRight: value }; },
												bottomKey: function( value ) { return { descriptionMarginBottom: value }; },
												leftKey: function( value ) { return { descriptionMarginLeft: value }; }
											},
											setAttributes
										)
									)
								);
							}

							return el(
								Fragment,
								null,
								el(
									PanelBody,
									{
										title: __( 'General', 'info-box-card' ),
										initialOpen: true
									},
									el( ToggleControl, {
										label: __( 'Enable Icon / Image', 'info-box-card' ),
										checked: showMedia,
										onChange: function( value ) {
											setAttributes( { showMedia: value } );
										}
									} ),
									showMedia
										? el( SelectControl, {
												label: __( 'Source', 'info-box-card' ),
												value: mediaType,
												options: MEDIA_TYPE_OPTIONS,
												onChange: function( value ) {
													setAttributes( { mediaType: value } );
												}
										  } )
										: null,
									showMedia && mediaType === 'icon'
										? el(
												Fragment,
												null,
												el( TextControl, {
													label: __( 'Search Font Awesome 4.7 icon', 'info-box-card' ),
													value: iconSearch,
													onChange: function( value ) {
														setAttributes( { iconSearch: value } );
													}
												} ),
												el( SelectControl, {
													label: __( 'Choose icon', 'info-box-card' ),
													value: selectedIcon,
													options: filteredIcons.map( function( icon ) {
														return { label: icon.replace( 'fa-', '' ), value: icon };
													} ),
													onChange: function( value ) {
														setAttributes( { selectedIcon: value } );
													}
												} ),
												el( TextControl, {
													label: __( 'Manual icon class', 'info-box-card' ),
													help: __( 'Use any Font Awesome 4.7 class like fa-heart.', 'info-box-card' ),
													value: selectedIcon,
													onChange: function( value ) {
														setAttributes( { selectedIcon: value || 'fa-star' } );
													}
												} )
										  )
										: null,
									showMedia && mediaType === 'image'
										? el(
												Fragment,
												null,
												el( MediaUploadCheck, null,
													el( MediaUpload, {
														onSelect: function( media ) {
															setAttributes( {
																imageUrl: media.url || '',
																imageAlt: media.alt || '',
																imageId: media.id || 0
															} );
														},
														allowedTypes: [ 'image' ],
														value: imageId,
														render: function( obj ) {
															return el(
																Button,
																{ variant: 'secondary', onClick: obj.open },
																imageUrl ? __( 'Replace image', 'info-box-card' ) : __( 'Choose image', 'info-box-card' )
															);
														}
													} )
												),
												imageUrl
													? el( Button, {
															variant: 'link',
															isDestructive: true,
															onClick: function() {
																setAttributes( { imageUrl: '', imageAlt: '', imageId: 0 } );
															},
															children: __( 'Remove image', 'info-box-card' )
													  } )
													: null
										  )
										: null,
									el( ToggleControl, {
										label: __( 'Enable Title', 'info-box-card' ),
										checked: showTitle,
										onChange: function( value ) {
											setAttributes( { showTitle: value } );
										}
									} ),
									showTitle
										? el( SelectControl, {
												label: __( 'Title tag', 'info-box-card' ),
												value: titleTag,
												options: TITLE_TAG_OPTIONS,
												onChange: function( value ) {
													setAttributes( { titleTag: value } );
												}
										  } )
										: null,
									el( ToggleControl, {
										label: __( 'Enable Description', 'info-box-card' ),
										checked: showDescription,
										onChange: function( value ) {
											setAttributes( { showDescription: value } );
										}
									} ),
									el( ToggleControl, {
										label: __( 'Show Call To Action Button', 'info-box-card' ),
										checked: showButton,
										onChange: function( value ) {
											setAttributes( { showButton: value } );
										}
									} ),
									showButton
										? el(
												Fragment,
												null,
												el( TextControl, {
													label: __( 'Button text', 'info-box-card' ),
													value: buttonText,
													onChange: function( value ) {
														setAttributes( { buttonText: value } );
													}
												} ),
												el(
													'div',
													{ className: 'sib-info-box__url-control' },
													el( 'label', { className: 'components-base-control__label' }, __( 'Button link', 'info-box-card' ) ),
													el( URLInputButton, {
														url: buttonUrl,
														onChange: function( value ) {
															setAttributes( { buttonUrl: value } );
														}
													} )
												)
										  )
										: null,
									el( SelectControl, {
										label: __( 'Card alignment', 'info-box-card' ),
										value: cardAlignment,
										options: ALIGNMENT_OPTIONS,
										onChange: function( value ) {
											setAttributes( { cardAlignment: value } );
										}
									} )
								)
							);
						}
					)
				),
				el(
					'div',
					blockProps,
					showMedia
						? el(
								'div',
								{ className: 'sib-info-box__media-wrap' },
								mediaNode
						  )
						: null,
					el(
						'div',
						{ className: 'sib-info-box__content' },
						showTitle
							? el( RichText, {
									tagName: titleTag,
									className: 'sib-info-box__title',
									value: titleText,
									style: titleStyle,
									allowedFormats: [],
									placeholder: __( 'Add title', 'info-box-card' ),
									onChange: function( value ) {
										setAttributes( { titleText: value } );
									}
							  } )
							: null,
						showDescription
							? el( RichText, {
									tagName: 'p',
									className: 'sib-info-box__description',
									value: descriptionText,
									style: descriptionStyle,
									placeholder: __( 'Add description', 'info-box-card' ),
									onChange: function( value ) {
										setAttributes( { descriptionText: value } );
									}
							  } )
							: null,
						showButton
							? el(
									'a',
									{
										className: 'sib-info-box__button',
										href: buttonUrl || '#'
									},
									buttonText || __( 'Learn More', 'info-box-card' )
							  )
							: null
					)
				)
			);
		},
		save: function Save( props ) {
			const { attributes } = props;
			const {
				showMedia,
				mediaType,
				selectedIcon,
				imageUrl,
				imageAlt,
				showTitle,
				titleTag,
				titleText,
				showDescription,
				descriptionText,
				showButton,
				cardAlignment,
				buttonText,
				buttonUrl,
				mediaStyle,
				mediaBorderRadius,
				mediaBackgroundColor,
				iconColor,
				iconFontSize,
				imageWidth,
				imageHeight,
				titleColor,
				titleFontSize,
				titleFontWeight,
				titleMarginTop,
				titleMarginRight,
				titleMarginBottom,
				titleMarginLeft,
				descriptionColor,
				descriptionMarginTop,
				descriptionMarginRight,
				descriptionMarginBottom,
				descriptionMarginLeft
			} = attributes;

			const blockProps = wp.blockEditor.useBlockProps.save( {
				className:
					'sib-info-box is-style-' +
					mediaStyle +
					' is-media-' +
					mediaType +
					' is-align-' +
					cardAlignment
			} );

			const titleStyle = {
				color: titleColor,
				fontSize: titleFontSize || '1.5rem',
				fontWeight: titleFontWeight,
				margin: marginStyle( titleMarginTop, titleMarginRight, titleMarginBottom, titleMarginLeft )
			};

			const mediaStyleObject = {
				borderRadius: mediaBorderRadius || '999px',
				width: imageWidth || '96px',
				height: imageHeight || '96px',
				backgroundColor: mediaBackgroundColor || '#e8f1fb'
			};

			const descriptionStyle = {
				color: descriptionColor,
				margin: marginStyle(
					descriptionMarginTop,
					descriptionMarginRight,
					descriptionMarginBottom,
					descriptionMarginLeft
				)
			};

			return el(
				'div',
				blockProps,
				showMedia
					? el(
							'div',
							{ className: 'sib-info-box__media-wrap' },
							mediaType === 'image'
								? imageUrl
									? el(
											'figure',
											{
												className: 'sib-info-box__figure',
												style: mediaStyleObject
											},
											el( 'img', {
												src: imageUrl,
												alt: imageAlt || '',
												className: 'sib-info-box__image',
												style: {
													borderRadius: mediaBorderRadius || '999px'
												}
											} )
									  )
									: null
								: el(
										'span',
										{
											className: 'sib-info-box__icon',
											style: Object.assign( {}, mediaStyleObject, {
												color: iconColor || '#2271b1',
												fontSize: iconFontSize || '36px'
											} )
										},
										el( 'i', { className: 'fa ' + selectedIcon, 'aria-hidden': 'true' } )
								  )
					  )
					: null,
				el(
					'div',
					{ className: 'sib-info-box__content' },
					showTitle
						? el( RichText.Content, {
								tagName: titleTag,
								className: 'sib-info-box__title',
								value: titleText,
								style: titleStyle
						  } )
						: null,
					showDescription
						? el( RichText.Content, {
								tagName: 'p',
								className: 'sib-info-box__description',
								value: descriptionText,
								style: descriptionStyle
						  } )
						: null,
					showButton
						? el(
								'a',
								{
									className: 'sib-info-box__button',
									href: buttonUrl || '#'
								},
								buttonText
						  )
						: null
				)
			);
		}
	} );
} )( window.wp );
