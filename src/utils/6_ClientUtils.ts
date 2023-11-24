'use client'

let htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @page {
            size: A4;
            margin: 100px;
            border: 2px solid #000;
            padding: 20px;
        }

        body {
            margin: 100px;
            background-color: #f4f1ee;
            font-family: Arial, sans-serif;
            font-size: 25px;
            border: 2px solid #000;
            padding: 20px;

            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }

            table,
            th,
            td {
                border: 1px solid #000;
            }

            th,
            td {
                padding: 10px;
                text-align: left;
            }

            strong {
                font-weight: bold;
                font-size: 30px;
            }

            h1 {
                text-align: center;
                font-size: 40px;
                margin-bottom: 20px;
            }

            p {
                font-size: 25px;
            }

            .page-break {
                page-break-before: always;
            }
    </style>
    <title>PDF Contract Template</title>
</head>

<body>

    <!-- PAGE 1 -->
    <div>
        <h1>MUSIC COPYRIGHT AGREEMENT</h1>
        <p>
            <strong>CONTRACT DETAILS : </strong>
        </p>
        <p>
            .
        </p>

        <table>
            <tr>
                <td>NAME :
                </td>
                <td>{{music_name}} copyright agreement
                </td>
            </tr>
            <tr>
                <td>CREATED :
                </td>
                <td>{{created}}
                </td>
            </tr>
            <tr>
                <td>PLATFORM DETAILS :
                </td>
                <td>ON CHAIN RADIO
                </td>
            </tr>
        </table>


        <p>
            <strong>ARTIST DETAILS : </strong><br>
        </p>

        <table>
            <tr>
                <td>ARTIST NAME
                </td>
                <td>{{artist_name}}
                </td>
            </tr>
            <tr>
                <td>COLLECTION TYPE
                </td>
                <td>{{collection_type}}
                </td>
            </tr>
            <tr>
                <td>COLLECTION NAME
                </td>
                <td>{{collection_name}}
                </td>
            </tr>
            <tr>
                <td>STREAMING TIMESTAMP
                </td>
                <td>{{stream_time}}
                </td>
            </tr>
            <tr>
                <td>SONG HASH ID
                </td>
                <td>{{song_hash}}
                </td>
            </tr>
        </table>


        <p>
            <strong>MONETIZATION DETAILS:</strong>
        </p>

        <table>
            <tr>
                <td>KYC VERIFIED?
                </td>
                <td>{{kyc}}
                </td>
            </tr>
            <tr>
                <td>NO. OF MAX. COPIES
                </td>
                <td>{{max_copies}}
                </td>
            </tr>
            <tr>
                <td>NO. OF COPIES RELEASED
                </td>
                <td>{{copies_released}}
                </td>
            </tr>
            <tr>
                <td>PRICE OF EACH COPIES
                </td>
                <td>{{price}}
                </td>
            </tr>
            <tr>
                <td>CERTIFICATES ACTIVATED
                </td>
                <td>{{certificates_activated}}
                </td>
            </tr>
            <tr>
                <td>CERTIFICATE IPFS ADDRESS
                </td>
                <td>{{ipfs_address}}
                </td>
            </tr>
            <tr>
                <td>COPY EXPIRY DEADLINE
                </td>
                <td>{{end_date}}
                </td>
            </tr>
        </table>


    </div>

    <div class="page-break"></div>

    <!-- PAGE 2 -->
    <p>
        This Agreement is entered into on <strong>{{Date}}</strong> by and between {{artist_name}}, hereinafter referred
        to as the "Licensor" and {{buyer_name}}, hereinafter referred to as the "Licensee".

    </p>
    <p>
        <strong>DURATION : </strong><br>
    </p>
    <p>
        This Agreement shall be effective from {{<strong>Start Date}}</strong> and will remain in force until
        {{<strong>end_date}}</strong>, unless terminated earlier in accordance with the terms outlined in this
        Agreement.
    </p>
    <p>
        <strong>GRANT OF RIGHTS : </strong>
    </p>
    <p>
        Exclusive Rights:
    </p>
    <p>
        {{rights}}
    </p>
    <p>
        Non-Exclusive Rights:
    </p>
    <p>
        The Licensor retains the right to grant non-exclusive rights to others.
    </p>

    <div class="page-break"></div>

    <!-- PAGE 3 -->
    <p>
        <strong>Terms and Conditions</strong>
    </p>
    <p>
        CONSIDERATION
    </p>
    <p>
        In consideration for the rights granted, the Licensee agrees to compensate the Licensor with {{price}} in APTOS.
    </p>
    <p>
        ROYALTIES<br>
    </p>
    <p>
        If applicable, the Licensee agrees to pay royalties to the Licensor based on {{specify_royalty_terms}} in APTOS.
    </p>
    <p>
        CREDIT AND ATTRIBUTIONS
    </p>
    <p>
        The Licensee shall credit the Licensor in all uses of the music as outlined in{{specify_credit_terms}}.
    </p>
    <p>
        MODIFICATIONS AND DERIVATIVE WORKS
    </p>
    <p>
        The Licensee may not modify the music or create derivative works without prior written consent from the
        Licensor.
    </p>
    <p>
        WARRANTIES AND REPRESENTATIONS
    </p>
    <p>
        Both parties represent and warrant that they have the right to enter into this Agreement and that the work is
        original.
    </p>
    <p>
        INDEMNIFICATION
    </p>
    <p>
        Both parties represent and warrant that they have the right to enter into this Agreement and that the work is
        original.
    </p>

    <div class="page-break"></div>

    <!-- PAGE 4 -->
    <p>
        <strong>Governing Law and Dispute Resolution</strong>
    </p>
    <p>
        This Agreement shall be governed by the laws of {{your_jurisdiction}}. Any disputes arising out of or in
        connection with this Agreement shall be resolved through{{specify_dispute_resolution_mechanism}}.
    </p>
    <p>
        By signing below, the parties acknowledge and agree to the terms and conditions set forth in this Decentralized
        Music Copyright Agreement.
    </p>
    <br>
    <br>
    <p>
        <strong>LICENSOR:</strong>
    </p>
    <p>
        {{artist_public_address}}
    </p>
    <p>
        {{artist_authentication_key}}
    </p>
    <p>
        {{hash}}
    </p>
    <p>
        {{artist_signature}}
    </p>
    <p>
        {{signature_timestamp}}
    </p>
</body>

</html>`;




export async function generatePDF(data: any) {
    console.log(data);

}
