'use server'
import axios from "axios";
import { PINATA_JWT } from "./3_Constants";

export const upload_to_ipfs = async (formdata: FormData) => {
    // UPLOAD FILE TO IPFS AND RETURN HASH OF THE FILE
    const ipfs_formdata = new FormData();
    const pinata_metadata = JSON.stringify({
        name: formdata.get('file_name'),
    });
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
    });
    ipfs_formdata.append('file', formdata.get('audio_file') as Blob);
    ipfs_formdata.append('pinataMetadata', pinata_metadata);
    ipfs_formdata.append('pinataOptions', pinataOptions);

    try {
        const res = await axios.post(
            'https://api.pinata.cloud/pinning/pinFileToIPFS',
            ipfs_formdata,
            {
                maxBodyLength: Infinity,
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${(ipfs_formdata as any)._boundary
                        }`,
                    Authorization: `Bearer ${PINATA_JWT}`,
                },
            }
        );
        return res.data.IpfsHash;
    } catch (err) {
        console.log('Error Uploading to IPFS', err);
        return '';
    }
};