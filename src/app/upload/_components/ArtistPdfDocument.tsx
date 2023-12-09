import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  // ------------------- PRIMARY COMPONENTS -----------------
  page: {
    display: 'flex',
    padding: '30px',
    flexDirection: 'column',
  },
  section: {
    flexGrow: 1,
    marginBottom: '20px',
  },
  table: {
    width: '100%',
  },
  tableCellLeft: {
    width: '40%',
    padding: '5px',
    fontSize: '20px',
    textAlign: 'left',
    border: '1px solid #000',
  },
  tableCellRight: {
    width: '60%',
    padding: '5px',
    fontSize: '20px',
    textAlign: 'left',
    border: '1px solid #000',
  },
  tableRow: {
    width: '100%',
    flexDirection: 'row',
  },
  h1: {
    fontSize: '20px',
    fontWeight: 800,
    marginBottom: '12px',
  },
  vspace: {
    height: '20px',
  },
  title: {
    fontSize: '30px',
    textAlign: 'center',
    marginBottom: '30px',
  },
  sizeLow: {
    fontSize: '13px',
  },
});

const Table = ({ object }: { object: Object }) => (
  <View style={styles.table}>
    {Object.entries(object).map((val, idx) => (
      <View style={styles.tableRow} key={idx}>
        <View style={styles.tableCellLeft}>
          <Text style={styles.sizeLow}>{val[0]}</Text>
        </View>
        <View style={styles.tableCellRight}>
          <Text style={styles.sizeLow}>{val[1]}</Text>
        </View>
      </View>
    ))}
  </View>
);
const TableSection = (section_name: string, table_object: any) => (
  <View style={styles.section}>
    <Text style={styles.h1}>{section_name}</Text>
    <Table object={table_object} />
  </View>
);

const Section = (section_name: string, content: any) => (
  <View style={styles.section}>
    <Text style={styles.h1}>{section_name}</Text>
    {content}
  </View>
);

const ArtistPDFDocument = ({
  artist_name = '',
  title = '',
  collection_type = '',
  collection_name = '',
  stream_time = new Date().toISOString(),
  song_hash = '',
  max_copies = 1,
  copies_released = 1,
  price = 1,
  transaction_hash = '',
  ipfs_address = '',
  end_date = new Date().toISOString(),
  artist_public_address = '',
  artist_public_key = '',
  hash = '',
  artist_signature = '',
  signature_timestamp = '',
  // HARD CODED VALUES
  kyc = 'true',
  certificates_activated = 'true',
  specify_dispute_resolution_mechanism = 'Dispute Resolution Mechanism',
  specify_royalty_terms = 'Royality Terms',
  your_jurisdiction = 'Your Jurisdiction',
  specify_credit_terms = 'Credit Terms',
  exclusive_rights = 'Rights',
}: any) => (
  <Document>
    {/* PAGE 1 */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>MUSIC COPYRIGHT AGREEMENT</Text>
      {TableSection('MUSIC COPYRIGHT AGREEMENT', {
        TITLE: title,
        CREATED: new Date().toISOString(),
        'PLATFORM DETAILS': 'ON CHAIN RADIO',
      })}
      {TableSection('ARTIST DETAILS', {
        'ARTIST NAME': artist_name,
        'COLLECTION TYPE': collection_type,
        'COLLECTION NAME': collection_name,
        'STREAMING TIMESTAMP': stream_time,
        'SONG HASH ID': song_hash,
      })}
      {TableSection('MONETIZATION DETAILS', {
        'KYC VERIFIED': kyc,
        'NO. OF MAX. COPIES': max_copies,
        'NO. OF COPIES RELEASED': copies_released,
        'PRICE OF EACH COPIES': price,
        'CERTIFICATES ACTIVATED': certificates_activated,
        'CERTIFICATE IPFS ADDRESS': ipfs_address,
        'COPY EXPIRY DEADLINE': end_date,
      })}
      <Text style={styles.sizeLow}>
        This Agreement is entered into on {new Date().getDate()}-
        {new Date().getMonth()}-{new Date().getFullYear()} by and between{' '}
        {artist_name}, hereinafter referred to as the &quot;Licensor&quot;,
        hereinafter referred to as the &quot;Licensee&quot;.
      </Text>
      <View style={styles.vspace}></View>
      {Section(
        'DURATION',
        (
          <Text style={styles.sizeLow}>
            This Agreement shall be effective from {new Date().getDate()}-
            {new Date().getMonth()}-{new Date().getFullYear()} and will remain
            in force until {end_date.slice(0, 10)}, unless terminated earlier in
            accordance with the terms outlined in this Agreement.
          </Text>
        ) as any
      )}
      {TableSection('GRANT OF RIGHTS', {
        'Exclusive Rights': exclusive_rights,
        'Non-Exclusive Rights':
          'The Licensor retains the right to grant non-exclusive rights to others.',
      })}
      {TableSection('TERMS AND CONDITIONS', {
        CONSIDERATION: `In consideration for the rights granted, the Licensee agrees to compensate the Licensor with ${price} in APTOS.`,
        ROYALTIES: `If applicable, the Licensee agrees to pay royalties to the Licensor based on ${specify_royalty_terms} in APTOS.`,
        'CREDIT AND ATTRIBUTIONS': `The Licensee shall credit the Licensor in all uses of the music as outlined in ${specify_credit_terms}.`,
        'MODIFICATIONS AND DERIVATIVE WORKS':
          'The Licensee may not modify the music or create derivative works without prior written consent from the Licensor.',
        'WARRANTIES AND REPRESENTATIONS':
          'Both parties represent and warrant that they have the right to enter into this Agreement and that the work is original.',
        INDEMNIFICATION:
          'Both parties represent and warrant that they have the right to enter into this Agreement and that the work is original.',
      })}
      {Section(
        'GOVERNING LAW AND DISPUTE RESOLUTION',
        (
          <Text style={styles.sizeLow}>
            This Agreement shall be governed by the laws of {your_jurisdiction}.
            Any disputes arising out of or in connection with this Agreement
            shall be resolved through
            {specify_dispute_resolution_mechanism}. By signing below, the
            parties acknowledge and agree to the terms and conditions set forth
            in this Decentralized Music Copyright Agreement.
          </Text>
        ) as any
      )}
      {TableSection('LICENSOR', {
        'Artist Public Address': artist_public_address,
        'Artist Authentication key': artist_public_key,
        Hash: hash,
        'Transaction hash': transaction_hash,
        'Artict Signature': artist_signature,
        'Signature Timestamp': signature_timestamp,
      })}
    </Page>
  </Document>
);

export default ArtistPDFDocument;
