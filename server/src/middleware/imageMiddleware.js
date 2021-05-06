const MAX_IMAGE_SIZE_IN_BYTES = 1000 * 1000 * 100;
const ALLOWED_MIMETYPES = ['image/jpg'];

module.exports = async (req,res,next) => {
    try{
        if(Object.keys(req.files).length !== 1){
            throw new Error('Nenhuma imagem enviada');
        }
        
        if(req.files.image.size > MAX_IMAGE_SIZE_IN_BYTES){
            throw new Error('Imagem muito grande');
        }
    
        if(!ALLOWED_MIMETYPES.includes(req.files.image.mimetype)){
            throw new Error('A imagem deve ser um jpg');
        }

        next();
    }catch(e){
        return res.status(400).json({error: e.message});
    }
}