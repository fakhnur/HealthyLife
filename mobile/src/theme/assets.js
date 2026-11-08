export const figmaAssets = {
  mealHero: require('../../assets/figma/meal-hero.png'),
  balancedMeal: require('../../assets/figma/balanced-meal.png'),
  budiAvatar: require('../../assets/figma/budi-avatar.png'),
  workout: require('../../assets/figma/workout.png'),
  mealThumb: require('../../assets/figma/meal-thumb.png'),
  exploreHero: require('../../assets/figma/explore-hero.png'),
  loginHero: require('../../assets/figma/login-hero.png'),
  registerHero: require('../../assets/figma/register-hero.png'),
};

/**
 * Resolves an image reference (URL string, relative path, or require object)
 * into a valid React Native Image `source` prop.
 */
export const resolveImageSource = (imageRef, fallbackKey = 'mealHero') => {
  if (!imageRef) {
    return figmaAssets[fallbackKey] || figmaAssets.mealHero;
  }
  // If already a required number or source object with uri
  if (typeof imageRef === 'number' || (typeof imageRef === 'object' && imageRef.uri)) {
    return imageRef;
  }
  if (typeof imageRef === 'string') {
    const lower = imageRef.toLowerCase().trim();
    if (lower.includes('meal-hero') || lower.includes('balanced-meal')) {
      return figmaAssets.mealHero;
    }
    if (lower.includes('workout') || lower.includes('latihan')) {
      return figmaAssets.workout;
    }
    if (lower.includes('budi-avatar') || lower.includes('avatar')) {
      return figmaAssets.budiAvatar;
    }
    if (lower.includes('meal-thumb') || lower.includes('kebiasaan')) {
      return figmaAssets.mealThumb;
    }
    if (lower.includes('explore-hero')) {
      return figmaAssets.exploreHero;
    }
    if (
      imageRef.startsWith('http://') ||
      imageRef.startsWith('https://') ||
      imageRef.startsWith('data:')
    ) {
      return { uri: imageRef };
    }
  }
  return figmaAssets[fallbackKey] || figmaAssets.mealHero;
};
