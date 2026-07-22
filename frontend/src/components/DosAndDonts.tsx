'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, ShieldCheck, AlertOctagon, CreditCard, ShieldAlert, Key, TrendingUp, FileText, QrCode, Briefcase, Package } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface CategoryGuidance {
  id: string;
  title: string;
  icon: React.ElementType;
  dos: string[];
  donts: string[];
}

const SAFETY_CATEGORIES: CategoryGuidance[] = [
  {
    id: 'upi',
    title: 'UPI Fraud',
    icon: CreditCard,
    dos: [
      'Verify the beneficiary name before approving any payment.',
      'Remember: UPI PIN is required ONLY to send money, NEVER to receive money.',
      'Check transaction history directly inside your bank or UPI app.',
      'Report un-authorized auto-debit requests immediately to bank.',
      'Call 1930 Cyber Helpline immediately if money is fraudulently deducted.'
    ],
    donts: [
      'Never enter your UPI PIN upon receiving SMS or collect requests.',
      'Never scan QR codes sent by buyers on OLX or social media.',
      'Never click on unknown payment links received via SMS.',
      'Never share bank account details or UPI VPA with unknown callers.',
      'Never trust un-verified customer care numbers found on Google search.'
    ]
  },
  {
    id: 'digital_arrest',
    title: 'Digital Arrest Scam',
    icon: ShieldAlert,
    dos: [
      'Understand that Indian Police/CBI/Customs NEVER arrest anyone over Skype/WhatsApp video calls.',
      'Verify suspicious calls by visiting your nearest local police station.',
      'Record the video call and note down the caller\'s phone number.',
      'Disconnect suspicious calls demanding digital interrogation immediately.',
      'Lodge a report on 1930 Cyber Fraud Helpline promptly.'
    ],
    donts: [
      'Never transfer money to "clearance accounts" or "RBI verification accounts".',
      'Never isolate yourself or stay on video call under coercion or threats.',
      'Never share Aadhaar, Passport, or Bank Account numbers over video calls.',
      'Never believe claims of drugs or illegal contraband found in package.',
      'Never panic when threatened with legal warrants over WhatsApp.'
    ]
  },
  {
    id: 'otp',
    title: 'OTP Fraud',
    icon: Key,
    dos: [
      'Keep One-Time Passwords (OTP) strictly confidential at all times.',
      'Read the full SMS text before entering any OTP to verify transaction details.',
      'Set strong biometric or 2FA protection on mobile banking apps.',
      'Inform your telecom operator if your SIM card suddenly stops working (SIM Swap).',
      'Report any suspicious OTP requests to your bank customer care.'
    ],
    donts: [
      'Never share OTP with anyone over phone call, SMS, or WhatsApp.',
      'Never read out OTP to caller claiming to be bank executive or courier agent.',
      'Never forward SMS messages containing verification codes.',
      'Never enter OTP on un-encrypted web forms (http://).',
      'Never grant remote access permissions (AnyDesk/TeamViewer) while receiving OTP.'
    ]
  },
  {
    id: 'investment',
    title: 'Investment Scam',
    icon: TrendingUp,
    dos: [
      'Verify SEBI registration status of stock brokers and investment advisors.',
      'Invest only through recognized stock exchanges (NSE/BSE) and registered apps.',
      'Conduct independent research before depositing money into trading platforms.',
      'Report fraudulent Telegram investment groups on 1930 helpline.',
      'Keep records of all bank transaction receipts and chat screenshots.'
    ],
    donts: [
      'Never trust promises of guaranteed 300%-500% returns in short periods.',
      'Never deposit money into personal bank accounts for stock trading.',
      'Never join secret VIP Telegram or WhatsApp stock tip groups.',
      'Never download un-verified trading APK files outside official App Stores.',
      'Never pay "withdrawal tax" or "service fees" to release trading profits.'
    ]
  },
  {
    id: 'kyc',
    title: 'KYC Scam',
    icon: FileText,
    dos: [
      'Perform KYC updates only at official bank branches or verified mobile apps.',
      'Cross-check SMS warnings regarding account suspension with official bank helpline.',
      'Report suspicious SMS links to 1930 Cyber Cell immediately.',
      'Keep your bank account registered with SMS alerts for instant updates.',
      'Preserve screenshots of phishing SMS messages for evidence.'
    ],
    donts: [
      'Never click links in SMS claiming "Your YONO / SBI / Electricity account is blocked".',
      'Never download unknown .APK files (e.g. sbi-update.apk) sent via WhatsApp.',
      'Never fill confidential net-banking passwords on unofficial websites.',
      'Never call helpline numbers provided in suspicious SMS messages.',
      'Never share PAN or Aadhaar card details with un-verified callers.'
    ]
  },
  {
    id: 'qr',
    title: 'QR Code Scam',
    icon: QrCode,
    dos: [
      'Remember that scanning QR codes is required ONLY to send/pay money.',
      'Verify merchant details displayed on the UPI app screen after scanning.',
      'Refuse QR code payment demands from unknown online buyers.',
      'Report fake buyer profiles on OLX/Quikr platforms immediately.',
      'Use secure UPI apps with real-time merchant verification.'
    ],
    donts: [
      'Never scan QR codes to receive advance payments or refunds.',
      'Never enter UPI PIN after scanning a QR code sent by a buyer.',
      'Never trust QR codes claiming to credit Army / Defence Canteen funds.',
      'Never scan QR codes received on WhatsApp from unknown buyers.',
      'Never approve money debit transactions under the guise of verification.'
    ]
  },
  {
    id: 'job',
    title: 'Job Scam',
    icon: Briefcase,
    dos: [
      'Verify company registration and official domain emails (e.g., hr@company.com).',
      'Check job listings on official corporate career portals.',
      'Report fake YouTube like/rating task groups to cyber authorities.',
      'Keep records of job offer letters and recruiter payment demands.',
      'Inform cyber crime helpline 1930 if defrauded under job pretext.'
    ],
    donts: [
      'Never pay "registration fees", "security deposits", or "laptop charges" for jobs.',
      'Never participate in Telegram tasks promising daily income for liking videos.',
      'Never accept job offers that require transferring money through cryptocurrency.',
      'Never share confidential bank details before signing official employment contracts.',
      'Never trust recruiters operating solely via Telegram or WhatsApp numbers.'
    ]
  },
  {
    id: 'courier',
    title: 'Courier Scam',
    icon: Package,
    dos: [
      'Track parcel status exclusively on official courier company websites.',
      'Verify any parcel delivery issue by calling official customer service.',
      'Report fake FedEx / Customs extortion calls to 1930 helpline.',
      'Check tracking numbers independently without clicking SMS links.',
      'Preserve call recordings of extortion demands as evidence.'
    ],
    donts: [
      'Never pay small "address update fees" or "customs duty" via SMS links.',
      'Never believe calls claiming your parcel contains illegal passports or drugs.',
      'Never transfer money to clear customs clearance holds over phone calls.',
      'Never connect to video calls with callers claiming to be Mumbai Customs.',
      'Never install remote access software to resolve parcel delivery issues.'
    ]
  }
];

export default function DosAndDonts() {
  const { t } = useLanguage();
  const [selectedCatId, setSelectedCatId] = useState('upi');

  const activeCategory = SAFETY_CATEGORIES.find(c => c.id === selectedCatId) || SAFETY_CATEGORIES[0];

  return (
    <section id="dos-donts" className="py-16 bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span>NDMA Government Safety Guidelines</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('dos_donts_heading')}</h2>
          <p className="text-slate-600 text-sm">{t('dos_donts_sub')}</p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SAFETY_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = cat.id === selectedCatId;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Two-Column Guidance Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* DO'S Column */}
          <div className="light-card p-6 border-t-4 border-t-emerald-600 bg-emerald-50/20 space-y-4">
            <div className="flex items-center space-x-3 border-b border-emerald-100 pb-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{t('col_dos')}</h3>
                <span className="text-xs text-emerald-700 font-mono font-semibold">Category: {activeCategory.title}</span>
              </div>
            </div>

            <ul className="space-y-3">
              {activeCategory.dos.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-xs text-slate-800 leading-relaxed font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DON'TS Column */}
          <div className="light-card p-6 border-t-4 border-t-red-600 bg-red-50/20 space-y-4">
            <div className="flex items-center space-x-3 border-b border-red-100 pb-3">
              <div className="p-2 rounded-xl bg-red-100 text-red-700">
                <XCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{t('col_donts')}</h3>
                <span className="text-xs text-red-700 font-mono font-semibold">Category: {activeCategory.title}</span>
              </div>
            </div>

            <ul className="space-y-3">
              {activeCategory.donts.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-xs text-slate-800 leading-relaxed font-medium">
                  <XCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}
