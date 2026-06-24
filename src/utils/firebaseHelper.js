import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';

// Collection references
const contactColRef = collection(db, 'contacts');
const newsletterColRef = collection(db, 'newsletters');
const tourColRef = collection(db, 'tours');
const mailColRef = collection(db, 'mail');

// Helper to trigger email forwarding (standard Trigger Email Firestore extension format)
export const sendEmailForward = async (type, data) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #fafafa;">
        <h2 style="color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-top: 0;">New Blisstown Submission: ${type}</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          ${Object.entries(data)
            .map(
              ([key, val]) => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eaeaea; font-weight: bold; width: 30%; color: #333333; text-transform: capitalize;">${key}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eaeaea; color: #555555;">${val}</td>
              </tr>
            `
            )
            .join('')}
        </table>
        <p style="margin-top: 20px; font-size: 12px; color: #999999; text-align: center;">This submission has been automatically logged in Blisstown Firestore and forwarded.</p>
      </div>
    `;

    await addDoc(mailColRef, {
      to: 'info@blisstown.co',
      message: {
        subject: `[Blisstown Lead] New ${type} submission`,
        text: Object.entries(data)
          .map(([key, val]) => `${key.toUpperCase()}: ${val}`)
          .join('\n'),
        html: htmlContent
      }
    });
  } catch (error) {
    console.error('Error adding document to mail collection:', error);
  }
};

// Helper to save a Contact Lead
export const submitContactForm = async (formData) => {
  const newLead = {
    name: formData.name,
    email: formData.email,
    subject: formData.subject,
    message: formData.message,
    date: new Date().toISOString(),
    status: 'New'
  };
  const docRef = await addDoc(contactColRef, newLead);

  // Trigger email notification forwarding
  await sendEmailForward('Contact Inquiry', {
    name: formData.name,
    email: formData.email,
    subject: formData.subject,
    message: formData.message,
    date: new Date().toLocaleString()
  });

  return { id: docRef.id, ...newLead };
};

// Helper to save a Newsletter Signup
export const submitNewsletterForm = async (email) => {
  // Check for duplicates first by fetching
  const q = query(newsletterColRef, where('email', '==', email.toLowerCase()));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return null; // Already subscribed
  }

  const newLead = {
    email: email.toLowerCase(),
    date: new Date().toISOString(),
    status: 'Active'
  };
  const docRef = await addDoc(newsletterColRef, newLead);

  // Trigger email notification forwarding
  await sendEmailForward('Newsletter Subscription', {
    email: email.toLowerCase(),
    date: new Date().toLocaleString()
  });

  return { id: docRef.id, ...newLead };
};

// Helper to save a Tour Booking Request
export const submitTourForm = async (formData) => {
  const newLead = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    preferredDate: formData.preferredDate || 'N/A',
    preferredTime: formData.preferredTime || 'N/A',
    residenceType: formData.residenceType || 'Duplex Penthouse',
    date: new Date().toISOString(),
    status: 'Pending'
  };
  const docRef = await addDoc(tourColRef, newLead);

  // Trigger email notification forwarding
  await sendEmailForward('Private Tour Booking', {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    preferredDate: formData.preferredDate || 'N/A',
    preferredTime: formData.preferredTime || 'N/A',
    residenceType: formData.residenceType || 'Duplex Penthouse',
    date: new Date().toLocaleString()
  });

  return { id: docRef.id, ...newLead };
};

// Helper to get all leads from a collection for Admin Dashboard
export const fetchLeads = async (collectionName) => {
  const colRef = collection(db, collectionName);
  const q = query(colRef, orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Helper to update status of a lead
export const updateLeadStatus = async (collectionName, leadId, newStatus) => {
  const docRef = doc(db, collectionName, leadId);
  await updateDoc(docRef, { status: newStatus });
};

// Helper to delete a lead record
export const deleteLead = async (collectionName, leadId) => {
  const docRef = doc(db, collectionName, leadId);
  await deleteDoc(docRef);
};
