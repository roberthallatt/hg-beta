const sharp = require('sharp')

const convertToAVIF = () => {
    sharp('./assets/img/hero.jpg')
    .toFormat('avif', {palette: true})
    .toFile(__dirname + '/assets/img/hero.avif')
}

convertToAVIF()