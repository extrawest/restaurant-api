"use client";
import { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ProductsByCategoriesCarouselProps } from 'shared';

import 'swiper/css';
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { CarouselItemImage, CarouselItemImageContainer } from './ProductsByCategoriesCarousel.styles';

export const ProductsByCategoriesCarousel: FC<ProductsByCategoriesCarouselProps> = ({ products }) => {
	return (
		<Swiper
      spaceBetween={30}
      slidesPerView={3}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
			{
				products.map((product, key) => {
					return (
						<SwiperSlide key={`${product.name}_${key}`}>
							<Card sx={{ maxWidth: 345 }}>
								<CardActionArea>
									<CardMedia
										component="img"
										height="140"
										image={product.image}
										alt="product_image"
									/>
									<CardContent>
										<Typography gutterBottom variant="h5" component="div">
											{product.name}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{
												new Intl.NumberFormat("en-US", {
													style: "currency",
													currency: product.currency,
												}).format(product.discountedPrice ? product.discountedPrice : product.price)
											}
										</Typography>
									</CardContent>
								</CardActionArea>
							</Card>
						</SwiperSlide>
					)
				})
			}
    </Swiper>
	)
};