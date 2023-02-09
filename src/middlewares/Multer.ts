import multer from "multer";

export const upload = multer({
    dest: './tmp',
    fileFilter: (req, file, cb) => {
        const allowed: string[] = ['image/jpg', 'image/jpeg', 'image/png'];

        cb(null, allowed.includes( file.mimetype ));
    },
    limits: { fileSize: 10485760 },

});