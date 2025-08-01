"use client"
import { useState, useEffect, useRef, useMemo } from "react"
import type React from "react"
import * as LucideIcons from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { CountdownBanner } from "@/components/countdown-banner"
import { SizeGuide } from "@/components/size-guide"
import { Faq } from "@/components/faq"
import { ThankYouModal } from "@/components/thank-you-modal"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { useProduct } from "@/contexts/product-context"
import Loading from "./loading"
import { addDoc, collection, doc, getDoc, getDocs, limit, query, where } from "firebase/firestore"
import { firestore } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MapPin, User } from "lucide-react"

interface CartItem {
  id: string
  name: string
  size: string
  color: string
  quantity: number
  price: number
  image: string
}
const wilayass=[
  {
    "id": 1,
    "name": "Adrar",
    "zone": 4,
    "is_deliverable": 1
  },
  {
    "id": 2,
    "name": "Chlef",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 3,
    "name": "Laghouat",
    "zone": 3,
    "is_deliverable": 1
  },
  {
    "id": 4,
    "name": "Oum El Bouaghi",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 5,
    "name": "Batna",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 6,
    "name": "Béjaïa",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 7,
    "name": "Biskra",
    "zone": 3,
    "is_deliverable": 1
  },
  {
    "id": 8,
    "name": "Béchar",
    "zone": 4,
    "is_deliverable": 1
  },
  {
    "id": 9,
    "name": "Blida",
    "zone": 1,
    "is_deliverable": 1
  },
  {
    "id": 10,
    "name": "Bouira",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 11,
    "name": "Tamanrasset",
    "zone": 4,
    "is_deliverable": 1
  },
  {
    "id": 12,
    "name": "Tébessa",
    "zone": 3,
    "is_deliverable": 1
  },
  {
    "id": 13,
    "name": "Tlemcen",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 14,
    "name": "Tiaret",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 15,
    "name": "Tizi Ouzou",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 16,
    "name": "Alger",
    "zone": 1,
    "is_deliverable": 1
  },
  {
    "id": 17,
    "name": "Djelfa",
    "zone": 3,
    "is_deliverable": 1
  },
  {
    "id": 18,
    "name": "Jijel",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 19,
    "name": "Sétif",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 20,
    "name": "Saïda",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 21,
    "name": "Skikda",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 22,
    "name": "Sidi Bel Abbès",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 23,
    "name": "Annaba",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 24,
    "name": "Guelma",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 25,
    "name": "Constantine",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 26,
    "name": "Médéa",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 27,
    "name": "Mostaganem",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 28,
    "name": "M'Sila",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 29,
    "name": "Mascara",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 30,
    "name": "Ouargla",
    "zone": 3,
    "is_deliverable": 1
  },
  {
    "id": 31,
    "name": "Oran",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 32,
    "name": "El Bayadh",
    "zone": 4,
    "is_deliverable": 1
  },
  {
    "id": 33,
    "name": "Illizi",
    "zone": 4,
    "is_deliverable": 1
  },
  {
    "id": 34,
    "name": "Bordj Bou Arreridj",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 35,
    "name": "Boumerdès",
    "zone": 1,
    "is_deliverable": 1
  },
  {
    "id": 36,
    "name": "El Tarf",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 37,
    "name": "Tindouf",
    "zone": 4,
    "is_deliverable": 1
  },
  {
    "id": 38,
    "name": "Tissemsilt",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 39,
    "name": "El Oued",
    "zone": 3,
    "is_deliverable": 1
  },
  {
    "id": 40,
    "name": "Khenchela",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 41,
    "name": "Souk Ahras",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 42,
    "name": "Tipaza",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 43,
    "name": "Mila",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 44,
    "name": "Aïn Defla",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 45,
    "name": "Naâma",
    "zone": 4,
    "is_deliverable": 1
  },
  {
    "id": 46,
    "name": "Aïn Témouchent",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 47,
    "name": "Ghardaïa",
    "zone": 3,
    "is_deliverable": 1
  },
  {
    "id": 48,
    "name": "Relizane",
    "zone": 2,
    "is_deliverable": 1
  },
  {
    "id": 49,
    "name": "Timimoun",
    "zone": 4,
    "is_deliverable": 1
  },
  {
    "id": 50,
    "name": "Bordj Badji Mokhtar",
    "zone": 4,
    "is_deliverable": 0
  },
  {
    "id": 51,
    "name": "Ouled Djellal",
    "zone": 4,
    "is_deliverable": 1
  },
  {
    "id": 52,
    "name": "Béni Abbès",
    "zone": 4,
    "is_deliverable": 1
  },
  {
    "id": 53,
    "name": "In Salah",
    "zone": 4,
    "is_deliverable": 1
  },
  {
    "id": 54,
    "name": "In Guezzam",
    "zone": 4,
    "is_deliverable": 0
  },
  {
    "id": 55,
    "name": "Touggourt",
    "zone": 4,
    "is_deliverable": 1
  },
  {
    "id": 56,
    "name": "Djanet",
    "zone": 4,
    "is_deliverable": 1
  },
  {
    "id": 57,
    "name": "El M'Ghair",
    "zone": 4,
    "is_deliverable": 1
  },
  {
    "id": 58,
    "name": "El Menia",
    "zone": 4,
    "is_deliverable": 1
  }
]
 const comuness=[
  {
    "id": 101,
    "name": "Adrar",
    "wilaya_id": 1,
    "wilaya_name": "Adrar",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 102,
    "name": "Tamest",
    "wilaya_id": 1,
    "wilaya_name": "Adrar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 104,
    "name": "Reggane",
    "wilaya_id": 1,
    "wilaya_name": "Adrar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 105,
    "name": "In Zghmir",
    "wilaya_id": 1,
    "wilaya_name": "Adrar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 106,
    "name": "Tit",
    "wilaya_id": 1,
    "wilaya_name": "Adrar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 25,
    "delivery_time_payment": 5
  },
  {
    "id": 108,
    "name": "Tsabit",
    "wilaya_id": 1,
    "wilaya_name": "Adrar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 111,
    "name": "Zaouiet Kounta",
    "wilaya_id": 1,
    "wilaya_name": "Adrar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 112,
    "name": "Aoulef",
    "wilaya_id": 1,
    "wilaya_name": "Adrar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 113,
    "name": "Tamekten",
    "wilaya_id": 1,
    "wilaya_name": "Adrar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 25,
    "delivery_time_payment": 15
  },
  {
    "id": 114,
    "name": "Tamantit",
    "wilaya_id": 1,
    "wilaya_name": "Adrar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 115,
    "name": "Fenoughil",
    "wilaya_id": 1,
    "wilaya_name": "Adrar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 118,
    "name": "Sali",
    "wilaya_id": 1,
    "wilaya_name": "Adrar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 119,
    "name": "Akabli",
    "wilaya_id": 1,
    "wilaya_name": "Adrar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 121,
    "name": "Ouled Ahmed Tammi",
    "wilaya_id": 1,
    "wilaya_name": "Adrar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 10
  },
  {
    "id": 122,
    "name": "Bouda",
    "wilaya_id": 1,
    "wilaya_name": "Adrar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 126,
    "name": "Sebaa",
    "wilaya_id": 1,
    "wilaya_name": "Adrar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 201,
    "name": "Abou El Hassan",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 202,
    "name": "Aïn Merane",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 203,
    "name": "Bénairia",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 204,
    "name": "Beni Bouateb",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 205,
    "name": "Beni Haoua",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 206,
    "name": "Beni Rached",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 207,
    "name": "Boukadir",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 208,
    "name": "Bouzeghaia",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 209,
    "name": "Breira",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 210,
    "name": "Chettia",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 211,
    "name": "Chlef",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 212,
    "name": "Dahra",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 5
  },
  {
    "id": 213,
    "name": "El Hadjadj",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 214,
    "name": "El Karimia",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 215,
    "name": "El Marsa",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 216,
    "name": "Harchoun",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 217,
    "name": "Harenfa",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 5
  },
  {
    "id": 218,
    "name": "Labiod Medjadja",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 219,
    "name": "Moussadek",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 5
  },
  {
    "id": 220,
    "name": "Oued Fodda",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 221,
    "name": "Oued Goussine",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 5
  },
  {
    "id": 222,
    "name": "Oued Sly",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 223,
    "name": "Ouled Abbes",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 224,
    "name": "Ouled Ben Abdelkader",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 225,
    "name": "Ouled Fares",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 226,
    "name": "Oum Drou",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 227,
    "name": "Sendjas",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 228,
    "name": "Sidi Abderrahmane",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 5
  },
  {
    "id": 229,
    "name": "Sidi Akkacha",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 230,
    "name": "Sobha",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 231,
    "name": "Tadjena",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 232,
    "name": "Talassa",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 233,
    "name": "Taougrite",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 234,
    "name": "Ténès",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 235,
    "name": "Zeboudja",
    "wilaya_id": 2,
    "wilaya_name": "Chlef",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 301,
    "name": "Laghouat",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 302,
    "name": "Ksar El Hirane",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 303,
    "name": "Bennasser Benchohra",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 304,
    "name": "Sidi Makhlouf",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 305,
    "name": "Hassi Delaa",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 306,
    "name": "Hassi R'Mel",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 307,
    "name": "Aïn Madhi",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 308,
    "name": "Tadjemout",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 309,
    "name": "Kheneg",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 310,
    "name": "Gueltat Sidi Saad",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 311,
    "name": "Aïn Sidi Ali",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 312,
    "name": "Beidha",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 313,
    "name": "Brida",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 314,
    "name": "El Ghicha",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 315,
    "name": "Hadj Mechri",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 316,
    "name": "Sebgag",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 317,
    "name": "Taouiala",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 318,
    "name": "Tadjrouna",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 319,
    "name": "Aflou",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 320,
    "name": "El Assafia",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 321,
    "name": "Oued Morra",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 322,
    "name": "Oued M'Zi",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 323,
    "name": "El Houaita",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 324,
    "name": "Sidi Bouzid",
    "wilaya_id": 3,
    "wilaya_name": "Laghouat",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 401,
    "name": "Oum el Bouaghi",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 402,
    "name": "Aïn Beïda",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 403,
    "name": "Aïn M'lila",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 404,
    "name": "Behir Chergui",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 405,
    "name": "El Amiria",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 406,
    "name": "Sigus",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 407,
    "name": "El Belala",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 408,
    "name": "Aïn Babouche",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 409,
    "name": "Berriche",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 410,
    "name": "Ouled Hamla",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 411,
    "name": "Dhalaa",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 412,
    "name": "Aïn Kercha",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 413,
    "name": "Hanchir Toumghani",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 414,
    "name": "El Djazia",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 415,
    "name": "Aïn Diss",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 416,
    "name": "Fkirina",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 417,
    "name": "Souk Naamane",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 418,
    "name": "Zorg",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 419,
    "name": "El Fedjoudj Boughrara Saoudi",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 420,
    "name": "Ouled Zouaï",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 421,
    "name": "Bir Chouhada",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 422,
    "name": "Ksar Sbahi",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 423,
    "name": "Oued Nini",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 424,
    "name": "Meskiana",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 425,
    "name": "Aïn Fakroun",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 426,
    "name": "Rahia",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 427,
    "name": "Aïn Zitoun",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 428,
    "name": "Ouled Gacem",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 429,
    "name": "El Harmilia",
    "wilaya_id": 4,
    "wilaya_name": "Oum El Bouaghi",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 501,
    "name": "Batna",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 502,
    "name": "Ghassira",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 503,
    "name": "Maafa",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 504,
    "name": "Merouana",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 505,
    "name": "Seriana",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 506,
    "name": "Menaa",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 507,
    "name": "El Madher",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 508,
    "name": "Tazoult",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 509,
    "name": "N'Gaous",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 510,
    "name": "Guigba",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 511,
    "name": "Inoughissen",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 512,
    "name": "Ouyoun El Assafir",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 513,
    "name": "Djerma",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 514,
    "name": "Bitam",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 515,
    "name": "Abdelkader Azil",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 516,
    "name": "Arris",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 517,
    "name": "Kimmel",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 518,
    "name": "Tilatou",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 519,
    "name": "Aïn Djasser",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 520,
    "name": "Ouled Sellam",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 521,
    "name": "Tigherghar",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 5
  },
  {
    "id": 522,
    "name": "Aïn Yagout",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 523,
    "name": "Fesdis",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 524,
    "name": "Sefiane",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 525,
    "name": "Rahbat",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 526,
    "name": "Tighanimine",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 527,
    "name": "Lemsane",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 528,
    "name": "Ksar Bellezma",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 529,
    "name": "Seggana",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 530,
    "name": "Ichmoul",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 531,
    "name": "Foum Toub",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 532,
    "name": "Ben Foudhala El Hakania",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 533,
    "name": "Oued El Ma",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 534,
    "name": "Talkhamt",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 535,
    "name": "Bouzina",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 536,
    "name": "Chemora",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 537,
    "name": "Oued Chaaba",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 538,
    "name": "Taxlent",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 539,
    "name": "Gosbat",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 540,
    "name": "Ouled Aouf",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 541,
    "name": "Boumagueur",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 542,
    "name": "Barika",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 543,
    "name": "Djezar",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 544,
    "name": "T'Kout",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 545,
    "name": "Aïn Touta",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 546,
    "name": "Hidoussa",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 547,
    "name": "Teniet El Abed",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 548,
    "name": "Oued Taga",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 549,
    "name": "Ouled Fadel",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 550,
    "name": "Timgad",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 551,
    "name": "Ras El Aioun",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 552,
    "name": "Chir",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 553,
    "name": "Ouled Si Slimane",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 554,
    "name": "Zanat El Beida",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 555,
    "name": "M'doukel",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 556,
    "name": "Ouled Ammar",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 557,
    "name": "El Hassi",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 558,
    "name": "Lazrou",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 559,
    "name": "Boumia (Batna)",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 560,
    "name": "Boulhilat",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 561,
    "name": "Larbaâ",
    "wilaya_id": 5,
    "wilaya_name": "Batna",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 601,
    "name": "Béjaïa",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 602,
    "name": "Amizour",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 603,
    "name": "Ferraoun",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 604,
    "name": "Taourirt Ighil",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 605,
    "name": "Chellata",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 606,
    "name": "Tamokra",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 607,
    "name": "Timezrit",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 608,
    "name": "Souk El Ténine",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 609,
    "name": "M'cisna",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 610,
    "name": "Tinabdher",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 611,
    "name": "Tichy",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 612,
    "name": "Semaoun",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 613,
    "name": "Kendira",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 614,
    "name": "Tifra",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 615,
    "name": "Ighram",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 616,
    "name": "Amalou",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 617,
    "name": "Ighil Ali",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 618,
    "name": "Fenaïa Ilmaten",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 619,
    "name": "Toudja",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 620,
    "name": "Darguina",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 621,
    "name": "Sidi Ayad",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 622,
    "name": "Aokas",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 623,
    "name": "Ait Djellil",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 624,
    "name": "Adekar",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 625,
    "name": "Akbou",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 626,
    "name": "Seddouk",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 627,
    "name": "Tazmalt",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 628,
    "name": "Aït R'zine",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 629,
    "name": "Chemini",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 630,
    "name": "Souk Oufella",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 631,
    "name": "Tibane",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 632,
    "name": "Tala Hamza",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 633,
    "name": "Barbacha",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 634,
    "name": "Aït Ksila",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 635,
    "name": "Ouzellaguen",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 636,
    "name": "Bouhamza",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 637,
    "name": "Taskriout",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 638,
    "name": "Aït Mellikeche",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 639,
    "name": "Sidi Aïch",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 640,
    "name": "El Kseur",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 641,
    "name": "Melbou",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 642,
    "name": "Akfadou",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 643,
    "name": "Leflaye",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 644,
    "name": "Kherrata",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 645,
    "name": "Draâ El Kaïd",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 646,
    "name": "Tamridjet",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 647,
    "name": "Aït Smail",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 648,
    "name": "Boukhelifa",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 649,
    "name": "Tizi N'Berber",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 650,
    "name": "Aït Maouche",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 651,
    "name": "Oued Ghir",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 652,
    "name": "Boudjellil",
    "wilaya_id": 6,
    "wilaya_name": "Béjaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 701,
    "name": "Aïn Naga",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 702,
    "name": "Aïn Zaatout",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 704,
    "name": "Biskra",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 705,
    "name": "Bordj Ben Azzouz",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 706,
    "name": "Bouchagroune",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 12,
    "delivery_time_payment": 2
  },
  {
    "id": 707,
    "name": "Branis",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 12,
    "delivery_time_payment": 2
  },
  {
    "id": 708,
    "name": "Chetma",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 709,
    "name": "Djemorah",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 12,
    "delivery_time_payment": 2
  },
  {
    "id": 712,
    "name": "El Feidh",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 12,
    "delivery_time_payment": 2
  },
  {
    "id": 713,
    "name": "El Ghrous",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 714,
    "name": "El Hadjeb",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 715,
    "name": "El Haouch",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 716,
    "name": "El Kantara",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 12,
    "delivery_time_payment": 2
  },
  {
    "id": 717,
    "name": "El Mizaraa",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 12,
    "delivery_time_payment": 2
  },
  {
    "id": 718,
    "name": "El Outaya",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 12,
    "delivery_time_payment": 2
  },
  {
    "id": 719,
    "name": "Foughala",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 720,
    "name": "Khenguet Sidi Nadji",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 721,
    "name": "Lichana",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 722,
    "name": "Lioua",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 12,
    "delivery_time_payment": 2
  },
  {
    "id": 723,
    "name": "M'Chouneche",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 724,
    "name": "Mekhadma",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 725,
    "name": "M'Lili",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 727,
    "name": "Oumache",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 12,
    "delivery_time_payment": 2
  },
  {
    "id": 728,
    "name": "Ourlal",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 12,
    "delivery_time_payment": 2
  },
  {
    "id": 731,
    "name": "Sidi Okba",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 732,
    "name": "Tolga",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 733,
    "name": "Zeribet El Oued",
    "wilaya_id": 7,
    "wilaya_name": "Biskra",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 12,
    "delivery_time_payment": 2
  },
  {
    "id": 801,
    "name": "Béchar",
    "wilaya_id": 8,
    "wilaya_name": "Béchar",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 10
  },
  {
    "id": 802,
    "name": "Erg Ferradj",
    "wilaya_id": 8,
    "wilaya_name": "Béchar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 15
  },
  {
    "id": 804,
    "name": "Meridja",
    "wilaya_id": 8,
    "wilaya_name": "Béchar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 10
  },
  {
    "id": 806,
    "name": "Lahmar",
    "wilaya_id": 8,
    "wilaya_name": "Béchar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 15
  },
  {
    "id": 809,
    "name": "Mechraa Houari Boumedienne",
    "wilaya_id": 8,
    "wilaya_name": "Béchar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 10
  },
  {
    "id": 810,
    "name": "Kenadsa",
    "wilaya_id": 8,
    "wilaya_name": "Béchar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 10
  },
  {
    "id": 813,
    "name": "Taghit",
    "wilaya_id": 8,
    "wilaya_name": "Béchar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 10
  },
  {
    "id": 815,
    "name": "Boukais",
    "wilaya_id": 8,
    "wilaya_name": "Béchar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 15
  },
  {
    "id": 816,
    "name": "Mougheul",
    "wilaya_id": 8,
    "wilaya_name": "Béchar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 10
  },
  {
    "id": 817,
    "name": "Abadla",
    "wilaya_id": 8,
    "wilaya_name": "Béchar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 10
  },
  {
    "id": 821,
    "name": "Beni Ounif",
    "wilaya_id": 8,
    "wilaya_name": "Béchar",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 10
  },
  {
    "id": 901,
    "name": "Blida",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 902,
    "name": "Chebli",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 903,
    "name": "Bouinan",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 904,
    "name": "Oued Alleug",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 907,
    "name": "Ouled Yaïch",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 908,
    "name": "Chréa",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 910,
    "name": "El Affroun",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 911,
    "name": "Chiffa",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 912,
    "name": "Hammam Melouane",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 913,
    "name": "Benkhelil",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 914,
    "name": "Soumaa",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 916,
    "name": "Mouzaia",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 917,
    "name": "Souhane",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 918,
    "name": "Meftah",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 919,
    "name": "Ouled Slama",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 920,
    "name": "Boufarik",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 921,
    "name": "Larbaa",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 922,
    "name": "Oued Djer",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 923,
    "name": "Beni Tamou",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 924,
    "name": "Bouarfa",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 925,
    "name": "Beni Mered",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 926,
    "name": "Bougara",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 927,
    "name": "Guerouaou",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 928,
    "name": "Aïn Romana",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 929,
    "name": "Djebabra",
    "wilaya_id": 9,
    "wilaya_name": "Blida",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1001,
    "name": "Aïn Bessem",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1002,
    "name": "Hanif",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1003,
    "name": "Aghbalou",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1004,
    "name": "Aïn El Hadjar",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1005,
    "name": "Ahl El Ksar",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1006,
    "name": "Aïn Laloui",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1007,
    "name": "Ath Mansour",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1008,
    "name": "Aomar",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1009,
    "name": "Aïn El Turc",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1010,
    "name": "Aït Laziz",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1011,
    "name": "Bouderbala",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1012,
    "name": "Bechloul",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1013,
    "name": "Bir Ghbalou",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1014,
    "name": "Boukram",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1015,
    "name": "Bordj Okhriss",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1016,
    "name": "Bouira",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1017,
    "name": "Chorfa",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1018,
    "name": "Dechmia",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1019,
    "name": "Dirrah",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1020,
    "name": "Djebahia",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1021,
    "name": "El Hakimia",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1022,
    "name": "El Hachimia",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1023,
    "name": "El Adjiba",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1024,
    "name": "El Khabouzia",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1025,
    "name": "El Mokrani",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1026,
    "name": "El Asnam",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1027,
    "name": "Guerrouma",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1028,
    "name": "Haizer",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1029,
    "name": "Hadjera Zerga",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1030,
    "name": "Kadiria",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1031,
    "name": "Lakhdaria",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1032,
    "name": "M'Chedallah",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1033,
    "name": "Mezdour",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1034,
    "name": "Maala",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1035,
    "name": "Maamora",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1036,
    "name": "Oued El Berdi",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1037,
    "name": "Ouled Rached",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1038,
    "name": "Raouraoua",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1039,
    "name": "Ridane",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1040,
    "name": "Saharidj",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1041,
    "name": "Sour El Ghouzlane",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1042,
    "name": "Souk El Khemis",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1043,
    "name": "Taguedit",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1044,
    "name": "Taghzout",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1045,
    "name": "Zbarbar",
    "wilaya_id": 10,
    "wilaya_name": "Bouira",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1101,
    "name": "Tamanrasset",
    "wilaya_id": 11,
    "wilaya_name": "Tamanrasset",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 10
  },
  {
    "id": 1102,
    "name": "Abalessa",
    "wilaya_id": 11,
    "wilaya_name": "Tamanrasset",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 5
  },
  {
    "id": 1105,
    "name": "Idles",
    "wilaya_id": 11,
    "wilaya_name": "Tamanrasset",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 5
  },
  {
    "id": 1106,
    "name": "Tazrouk",
    "wilaya_id": 11,
    "wilaya_name": "Tamanrasset",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 5
  },
  {
    "id": 1109,
    "name": "In Amguel",
    "wilaya_id": 11,
    "wilaya_name": "Tamanrasset",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 5
  },
  {
    "id": 1201,
    "name": "Tébessa",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1202,
    "name": "Bir el Ater",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1203,
    "name": "Cheria",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1204,
    "name": "Stah Guentis",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1205,
    "name": "El Aouinet",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1206,
    "name": "El Houidjbet",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1207,
    "name": "Safsaf El Ouesra",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1208,
    "name": "Hammamet",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1209,
    "name": "Negrine",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1210,
    "name": "Bir Mokkadem",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1211,
    "name": "El Kouif",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1212,
    "name": "Morsott",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1213,
    "name": "El Ogla",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1214,
    "name": "Bir Dheb",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1215,
    "name": "Ogla Melha",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1216,
    "name": "Guorriguer",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1217,
    "name": "Bekkaria",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1218,
    "name": "Boukhadra",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1219,
    "name": "Ouenza",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1220,
    "name": "El Ma Labiodh",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1221,
    "name": "Oum Ali",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1222,
    "name": "Tlidjene",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1223,
    "name": "Aïn Zerga",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1224,
    "name": "El Meridj",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1225,
    "name": "Boulhaf Dir",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1226,
    "name": "Bedjene",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1227,
    "name": "El Mezeraa",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 1228,
    "name": "Ferkane",
    "wilaya_id": 12,
    "wilaya_name": "Tébessa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1301,
    "name": "Tlemcen",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1302,
    "name": "Beni Mester",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1303,
    "name": "Aïn Tallout",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1304,
    "name": "Remchi",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1305,
    "name": "El Fehoul",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1306,
    "name": "Sabra",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1307,
    "name": "Ghazaouet",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1308,
    "name": "Souani",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1309,
    "name": "Djebala",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1310,
    "name": "El Gor",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1311,
    "name": "Oued Lakhdar",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1312,
    "name": "Aïn Fezza",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1313,
    "name": "Ouled Mimoun",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1314,
    "name": "Amieur",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1315,
    "name": "Aïn Youcef",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1316,
    "name": "Zenata",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1317,
    "name": "Beni Snous",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1318,
    "name": "Bab El Assa",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1319,
    "name": "Dar Yaghmouracene",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1320,
    "name": "Fellaoucene",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1321,
    "name": "Azails",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1322,
    "name": "Sebaa Chioukh",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1323,
    "name": "Terny Beni Hdiel",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1324,
    "name": "Bensekrane",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1325,
    "name": "Aïn Nehala",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1326,
    "name": "Hennaya",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1327,
    "name": "Maghnia",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1328,
    "name": "Hammam Boughrara",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1329,
    "name": "Souahlia",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1330,
    "name": "MSirda Fouaga",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1331,
    "name": "Aïn Fetah",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1332,
    "name": "El Aricha",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1333,
    "name": "Souk Tlata",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1334,
    "name": "Sidi Abdelli",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1335,
    "name": "Sebdou",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1336,
    "name": "Beni Ouarsous",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1337,
    "name": "Sidi Medjahed",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1338,
    "name": "Beni Boussaid",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1339,
    "name": "Marsa Ben M'Hidi",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1340,
    "name": "Nedroma",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1341,
    "name": "Sidi Djillali",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1342,
    "name": "Beni Bahdel",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1343,
    "name": "El Bouihi",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1344,
    "name": "Honaïne",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1345,
    "name": "Tienet",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1346,
    "name": "Ouled Riyah",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1347,
    "name": "Bouhlou",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1348,
    "name": "Beni Khellad",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1349,
    "name": "Aïn Ghoraba",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1350,
    "name": "Chetouane",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1351,
    "name": "Mansourah",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1352,
    "name": "Beni Semiel",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1353,
    "name": "Aïn Kebira",
    "wilaya_id": 13,
    "wilaya_name": "Tlemcen",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1401,
    "name": "Aïn Bouchekif",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1402,
    "name": "Aïn Deheb",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1403,
    "name": "Aïn El Hadid",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 6,
    "delivery_time_payment": 2
  },
  {
    "id": 1404,
    "name": "Aïn Kermes",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 6,
    "delivery_time_payment": 2
  },
  {
    "id": 1405,
    "name": "Aïn Dzarit",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1406,
    "name": "Bougara",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 6,
    "delivery_time_payment": 2
  },
  {
    "id": 1407,
    "name": "Chehaima",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 6,
    "delivery_time_payment": 2
  },
  {
    "id": 1408,
    "name": "Dahmouni",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1409,
    "name": "Djebilet Rosfa",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 1410,
    "name": "Djillali Ben Amar",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 6,
    "delivery_time_payment": 2
  },
  {
    "id": 1411,
    "name": "Faidja",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1412,
    "name": "Frenda",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 6,
    "delivery_time_payment": 2
  },
  {
    "id": 1413,
    "name": "Guertoufa",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1414,
    "name": "Hamadia",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 6,
    "delivery_time_payment": 2
  },
  {
    "id": 1415,
    "name": "Ksar Chellala",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 1416,
    "name": "Madna",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1417,
    "name": "Mahdia",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 6,
    "delivery_time_payment": 2
  },
  {
    "id": 1418,
    "name": "Mechraa Safa",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 6,
    "delivery_time_payment": 2
  },
  {
    "id": 1419,
    "name": "Medrissa",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1420,
    "name": "Medroussa",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 6,
    "delivery_time_payment": 2
  },
  {
    "id": 1421,
    "name": "Meghila",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 6,
    "delivery_time_payment": 2
  },
  {
    "id": 1422,
    "name": "Mellakou",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1423,
    "name": "Nadorah",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1424,
    "name": "Naima",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1425,
    "name": "Oued Lilli",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 6,
    "delivery_time_payment": 2
  },
  {
    "id": 1426,
    "name": "Rahouia",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 6,
    "delivery_time_payment": 2
  },
  {
    "id": 1427,
    "name": "Rechaiga",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 1428,
    "name": "Sebaine",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1429,
    "name": "Sebt",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1430,
    "name": "Serghine",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1431,
    "name": "Si Abdelghani",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1432,
    "name": "Sidi Abderahmane",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 6,
    "delivery_time_payment": 2
  },
  {
    "id": 1433,
    "name": "Sidi Ali Mellal",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1434,
    "name": "Sidi Bakhti",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1435,
    "name": "Sidi Hosni",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 6,
    "delivery_time_payment": 2
  },
  {
    "id": 1436,
    "name": "Sougueur",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 6,
    "delivery_time_payment": 2
  },
  {
    "id": 1437,
    "name": "Tagdemt",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 6,
    "delivery_time_payment": 2
  },
  {
    "id": 1438,
    "name": "Takhemaret",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 6,
    "delivery_time_payment": 2
  },
  {
    "id": 1439,
    "name": "Tiaret",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 6,
    "delivery_time_payment": 2
  },
  {
    "id": 1440,
    "name": "Tidda",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1441,
    "name": "Tousnina",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1442,
    "name": "Zmalet El Emir Abdelkader",
    "wilaya_id": 14,
    "wilaya_name": "Tiaret",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 1501,
    "name": "Tizi Ouzou",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1502,
    "name": "Ain El Hammam",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1503,
    "name": "Akbil",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1504,
    "name": "Freha",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1505,
    "name": "Souamaâ",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1506,
    "name": "Mechtras",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1507,
    "name": "Irdjen",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1508,
    "name": "Timizart",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1509,
    "name": "Makouda",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1510,
    "name": "Draâ El Mizan",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1511,
    "name": "Tizi Gheniff",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1512,
    "name": "Bounouh",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1513,
    "name": "Aït Chafâa",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1514,
    "name": "Frikat",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1515,
    "name": "Beni Aïssi",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1516,
    "name": "Beni Zmenzer",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1517,
    "name": "Iferhounène",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1518,
    "name": "Azazga",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1519,
    "name": "Illoula Oumalou",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1520,
    "name": "Yakouren",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1521,
    "name": "Larbaâ Nath Irathen",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1522,
    "name": "Tizi Rached",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1523,
    "name": "Zekri",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1524,
    "name": "Ouaguenoun",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1525,
    "name": "Aïn Zaouia",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1526,
    "name": "M'Kira",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1527,
    "name": "Aït Yahia",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1528,
    "name": "Aït Mahmoud",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1529,
    "name": "Mâatkas",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1530,
    "name": "Aït Boumahdi",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1531,
    "name": "Abi Youcef",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1532,
    "name": "Beni Douala",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1533,
    "name": "Illilten",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1534,
    "name": "Bouzguen",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1535,
    "name": "Aït Aggouacha",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1536,
    "name": "Ouadhia",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1537,
    "name": "Azeffoun",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1538,
    "name": "Tigzirt",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1539,
    "name": "Aït Aïssa Mimoun",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1540,
    "name": "Boghni",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1541,
    "name": "Ifigha",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1542,
    "name": "Aït Oumalou",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1543,
    "name": "Tirmitine",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1544,
    "name": "Akerrou",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1545,
    "name": "Yatafen",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1546,
    "name": "Ath Zikki",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1547,
    "name": "Draâ Ben Khedda",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1548,
    "name": "Ouacif",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1549,
    "name": "Idjeur",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1550,
    "name": "Mekla",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1551,
    "name": "Tizi N'Tleta",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1552,
    "name": "Aït Yenni",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1553,
    "name": "Aghribs",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1554,
    "name": "Iflissen",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1555,
    "name": "Boudjima",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1556,
    "name": "Aït Yahia Moussa",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1557,
    "name": "Souk El Thenine",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1558,
    "name": "Aït Khellili",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1559,
    "name": "Sidi Namane",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1560,
    "name": "Iboudraren",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1561,
    "name": "Agouni Gueghrane",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1562,
    "name": "Mizrana",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1563,
    "name": "Imsouhel",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1564,
    "name": "Tadmaït",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1565,
    "name": "Aït Bouadou",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1566,
    "name": "Assi Youcef",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1567,
    "name": "Aït Toudert",
    "wilaya_id": 15,
    "wilaya_name": "Tizi Ouzou",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1601,
    "name": "Alger Centre",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1602,
    "name": "Sidi M'Hamed",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1603,
    "name": "El Madania",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1604,
    "name": "Belouizdad",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1605,
    "name": "Bab El Oued",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1606,
    "name": "Bologhine",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1607,
    "name": "Casbah",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1608,
    "name": "Oued Koriche",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1609,
    "name": "Bir Mourad Raïs",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1610,
    "name": "El Biar",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1611,
    "name": "Bouzareah",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1612,
    "name": "Birkhadem",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1613,
    "name": "El Harrach",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1614,
    "name": "Baraki",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1615,
    "name": "Oued Smar",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1616,
    "name": "Bachdjerrah",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1617,
    "name": "Hussein Dey",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1618,
    "name": "Kouba",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1619,
    "name": "Bourouba",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1620,
    "name": "Dar El Beïda",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1621,
    "name": "Bab Ezzouar",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1622,
    "name": "Ben Aknoun",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1623,
    "name": "Dely Ibrahim",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1624,
    "name": "El Hammamet",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1625,
    "name": "Raïs Hamidou",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1626,
    "name": "Djasr Kasentina",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1627,
    "name": "El Mouradia",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1628,
    "name": "Hydra",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1629,
    "name": "Mohammadia",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1630,
    "name": "Bordj El Kiffan",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1631,
    "name": "El Magharia",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1632,
    "name": "Beni Messous",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1633,
    "name": "Les Eucalyptus",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1634,
    "name": "Birtouta",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1635,
    "name": "Tessala El Merdja",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1636,
    "name": "Ouled Chebel",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1637,
    "name": "Sidi Moussa",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1638,
    "name": "Aïn Taya",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1639,
    "name": "Bordj El Bahri",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1640,
    "name": "El Marsa",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1641,
    "name": "H'raoua",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1642,
    "name": "Rouïba",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1643,
    "name": "Reghaïa",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1644,
    "name": "Aïn Benian",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1645,
    "name": "Staoueli",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1646,
    "name": "Zeralda",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1647,
    "name": "Mahelma",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1648,
    "name": "Rahmania",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1649,
    "name": "Souidania",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1650,
    "name": "Cheraga",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1651,
    "name": "Ouled Fayet",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1652,
    "name": "El Achour",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1653,
    "name": "Draria",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1654,
    "name": "Douera",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1655,
    "name": "Baba Hassen",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1656,
    "name": "Khraicia",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1657,
    "name": "Saoula",
    "wilaya_id": 16,
    "wilaya_name": "Alger",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1701,
    "name": "Aïn Chouhada",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1702,
    "name": "Aïn El Ibel",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1703,
    "name": "Aïn Feka",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1704,
    "name": "Aïn Maabed",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1705,
    "name": "Aïn Oussara",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1706,
    "name": "Amourah",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1707,
    "name": "Benhar",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1708,
    "name": "Beni Yagoub",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1709,
    "name": "Birine",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1710,
    "name": "Bouira Lahdab",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1711,
    "name": "Charef",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1712,
    "name": "Dar Chioukh",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1713,
    "name": "Deldoul",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1714,
    "name": "Djelfa",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1715,
    "name": "Douis",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1716,
    "name": "El Guedid",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1717,
    "name": "El Idrissia",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1718,
    "name": "El Khemis",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1719,
    "name": "Faidh El Botma",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1720,
    "name": "Guernini",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1721,
    "name": "Guettara",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1722,
    "name": "Had Sahary",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1723,
    "name": "Hassi Bahbah",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1724,
    "name": "Hassi El Euch",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1725,
    "name": "Hassi Fedoul",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1726,
    "name": "Messaad",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1727,
    "name": "M'Liliha",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1728,
    "name": "Moudjebara",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1729,
    "name": "Oum Laadham",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1730,
    "name": "Sed Rahal",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 1731,
    "name": "Selmana",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 10
  },
  {
    "id": 1732,
    "name": "Sidi Baizid",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 10
  },
  {
    "id": 1733,
    "name": "Sidi Ladjel",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 10
  },
  {
    "id": 1734,
    "name": "Tadmit",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 10
  },
  {
    "id": 1735,
    "name": "Zaafrane",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 10
  },
  {
    "id": 1736,
    "name": "Zaccar",
    "wilaya_id": 17,
    "wilaya_name": "Djelfa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 10
  },
  {
    "id": 1801,
    "name": "Jijel",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1802,
    "name": "Eraguene",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1803,
    "name": "El Aouana",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1804,
    "name": "Ziama Mansouriah",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1805,
    "name": "Taher",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1806,
    "name": "Emir Abdelkader",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1807,
    "name": "Chekfa",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1808,
    "name": "Chahna",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1809,
    "name": "El Milia",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1810,
    "name": "Sidi Maarouf",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1811,
    "name": "Settara",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1812,
    "name": "El Ancer",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1813,
    "name": "Sidi Abdelaziz",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1814,
    "name": "Kaous",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1815,
    "name": "Ghebala",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1816,
    "name": "Bouraoui Belhadef",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1817,
    "name": "Djimla",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1818,
    "name": "Selma Benziada",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1819,
    "name": "Boucif Ouled Askeur",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1820,
    "name": "El Kennar Nouchfi",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1821,
    "name": "Ouled Yahia Khedrouche",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1822,
    "name": "Boudriaa Ben Yadjis",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1823,
    "name": "Kheïri Oued Adjoul",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1824,
    "name": "Texenna",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1825,
    "name": "Djemaa Beni Habibi",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1826,
    "name": "Bordj Tahar",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1827,
    "name": "Ouled Rabah",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1828,
    "name": "Ouadjana",
    "wilaya_id": 18,
    "wilaya_name": "Jijel",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1901,
    "name": "Aïn Abessa",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1902,
    "name": "Aïn Arnat",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1903,
    "name": "Aïn Azel",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 1904,
    "name": "Aïn El Kebira",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 1905,
    "name": "Aïn Lahdjar",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1906,
    "name": "Aïn Legradj",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 1907,
    "name": "Aïn Oulmene",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1908,
    "name": "Aïn Roua",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1909,
    "name": "Aïn Sebt",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1910,
    "name": "Aït Naoual Mezada",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 1911,
    "name": "Aït Tizi",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1912,
    "name": "Aït Wertilan",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1913,
    "name": "Amoucha",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 1914,
    "name": "Babor",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1915,
    "name": "Bazer Sakhra",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 1916,
    "name": "Beidha Bordj",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1917,
    "name": "Belaa",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1918,
    "name": "Beni Aziz",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1919,
    "name": "Beni Chebana",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 1920,
    "name": "Beni Fouda",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1921,
    "name": "Beni Hocine",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1922,
    "name": "Beni Mouhli",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1923,
    "name": "Bir El Arch",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 1924,
    "name": "Bir Haddada",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 1925,
    "name": "Bouandas",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1926,
    "name": "Bougaa",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 1927,
    "name": "Bousselam",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1928,
    "name": "Boutaleb",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 1929,
    "name": "Dehamcha",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1930,
    "name": "Djemila",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1931,
    "name": "Draa Kebila",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1932,
    "name": "El Eulma",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1933,
    "name": "El Ouldja",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1934,
    "name": "El Ouricia",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1935,
    "name": "Guellal",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1936,
    "name": "Guelta Zerka",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 1937,
    "name": "Guenzet",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1938,
    "name": "Guidjel",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1939,
    "name": "Hamma",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1940,
    "name": "Hammam Guergour",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1941,
    "name": "Hammam Soukhna",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1942,
    "name": "Harbil",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1943,
    "name": "Ksar El Abtal",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 1944,
    "name": "Maaouia",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1945,
    "name": "Maoklane",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1946,
    "name": "Mezloug",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1947,
    "name": "Oued El Barad",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1948,
    "name": "Ouled Addouane",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1949,
    "name": "Ouled Sabor",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1950,
    "name": "Ouled Si Ahmed",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1951,
    "name": "Ouled Tebben",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1952,
    "name": "Rasfa",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1953,
    "name": "Salah Bey",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 1954,
    "name": "Serdj El Ghoul",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1955,
    "name": "Sétif",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 1956,
    "name": "Tachouda",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 1957,
    "name": "Talaifacene",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 1958,
    "name": "Taya",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 1959,
    "name": "Tella",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 1960,
    "name": "Tizi N'Bechar",
    "wilaya_id": 19,
    "wilaya_name": "Sétif",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 2001,
    "name": "Aïn El Hadjar",
    "wilaya_id": 20,
    "wilaya_name": "Saïda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2002,
    "name": "Aïn Sekhouna",
    "wilaya_id": 20,
    "wilaya_name": "Saïda",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2003,
    "name": "Aïn Soltane",
    "wilaya_id": 20,
    "wilaya_name": "Saïda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2004,
    "name": "Doui Thabet",
    "wilaya_id": 20,
    "wilaya_name": "Saïda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2005,
    "name": "El Hassasna",
    "wilaya_id": 20,
    "wilaya_name": "Saïda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2006,
    "name": "Hounet",
    "wilaya_id": 20,
    "wilaya_name": "Saïda",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2007,
    "name": "Maamora",
    "wilaya_id": 20,
    "wilaya_name": "Saïda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2008,
    "name": "Moulay Larbi",
    "wilaya_id": 20,
    "wilaya_name": "Saïda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 2009,
    "name": "Ouled Brahim",
    "wilaya_id": 20,
    "wilaya_name": "Saïda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 2010,
    "name": "Ouled Khaled",
    "wilaya_id": 20,
    "wilaya_name": "Saïda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2011,
    "name": "Saïda",
    "wilaya_id": 20,
    "wilaya_name": "Saïda",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2012,
    "name": "Sidi Ahmed",
    "wilaya_id": 20,
    "wilaya_name": "Saïda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2013,
    "name": "Sidi Amar",
    "wilaya_id": 20,
    "wilaya_name": "Saïda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2014,
    "name": "Sidi Boubekeur",
    "wilaya_id": 20,
    "wilaya_name": "Saïda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 2015,
    "name": "Tircine",
    "wilaya_id": 20,
    "wilaya_name": "Saïda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2016,
    "name": "Youb",
    "wilaya_id": 20,
    "wilaya_name": "Saïda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 2101,
    "name": "Aïn Bouziane",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2102,
    "name": "Aïn Charchar",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2103,
    "name": "Aïn Kechra",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2104,
    "name": "Aïn Zouit",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2105,
    "name": "Azzaba",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2106,
    "name": "Bekkouche Lakhdar",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2107,
    "name": "Bin El Ouiden",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2108,
    "name": "Ben Azzouz",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2109,
    "name": "Beni Bechir",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2110,
    "name": "Beni Oulbane",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2111,
    "name": "Beni Zid",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2112,
    "name": "Bouchtata",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 2113,
    "name": "Cheraia",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2114,
    "name": "Collo",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2115,
    "name": "Djendel Saadi Mohamed",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2116,
    "name": "El Ghedir",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2117,
    "name": "El Hadaiek",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2118,
    "name": "El Harrouch",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2119,
    "name": "El Marsa",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2120,
    "name": "Emdjez Edchich",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2121,
    "name": "Es Sebt",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2122,
    "name": "Filfila",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2123,
    "name": "Hamadi Krouma",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2124,
    "name": "Kanoua",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2125,
    "name": "Kerkera",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2126,
    "name": "Kheneg Mayoum",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2127,
    "name": "Oued Zehour",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2128,
    "name": "Ouldja Boulballout",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2129,
    "name": "Ouled Attia",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2130,
    "name": "Ouled Hbaba",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2131,
    "name": "Oum Toub",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2132,
    "name": "Ramdane Djamel",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2133,
    "name": "Salah Bouchaour",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2134,
    "name": "Sidi Mezghiche",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2135,
    "name": "Skikda",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2136,
    "name": "Tamalous",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2137,
    "name": "Zerdaza",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2138,
    "name": "Zitouna",
    "wilaya_id": 21,
    "wilaya_name": "Skikda",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2201,
    "name": "Aïn Adden",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2202,
    "name": "Aïn El Berd",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2203,
    "name": "Aïn Kada",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2204,
    "name": "Aïn Thrid",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2205,
    "name": "Aïn Tindamine",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2206,
    "name": "Amarnas",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2207,
    "name": "Badredine El Mokrani",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2208,
    "name": "Belarbi",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2209,
    "name": "Ben Badis",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2210,
    "name": "Benachiba Chelia",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2211,
    "name": "Bir El Hammam",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2212,
    "name": "Boudjebaa El Bordj",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2213,
    "name": "Boukhanafis",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2214,
    "name": "Chettouane Belaila",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2215,
    "name": "Dhaya",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2216,
    "name": "El Haçaiba",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2217,
    "name": "Hassi Dahou",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2218,
    "name": "Hassi Zehana",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2219,
    "name": "Lamtar",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2220,
    "name": "Makedra",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2221,
    "name": "Marhoum",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2222,
    "name": "M'Cid",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2223,
    "name": "Merine",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2224,
    "name": "Mezaourou",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2225,
    "name": "Mostefa Ben Brahim",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2226,
    "name": "Moulay Slissen",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2227,
    "name": "Oued Sebaa",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2228,
    "name": "Oued Sefioun",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2229,
    "name": "Oued Taourira",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2230,
    "name": "Ras El Ma",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2231,
    "name": "Redjem Demouche",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2232,
    "name": "Sehala Thaoura",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2233,
    "name": "Sfisef",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2234,
    "name": "Sidi Ali Benyoub",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2235,
    "name": "Sidi Ali Boussidi",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2236,
    "name": "Sidi Bel Abbes",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2237,
    "name": "Sidi Brahim",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2238,
    "name": "Sidi Chaib",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2239,
    "name": "Sidi Daho des Zairs",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2240,
    "name": "Sidi Hamadouche",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2241,
    "name": "Sidi Khaled",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2242,
    "name": "Sidi Lahcene",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2243,
    "name": "Sidi Yacoub",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2244,
    "name": "Tabia",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2245,
    "name": "Tafissour",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2246,
    "name": "Taoudmout",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2247,
    "name": "Teghalimet",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2248,
    "name": "Telagh",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2249,
    "name": "Tenira",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2250,
    "name": "Tessala",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2251,
    "name": "Tilmouni",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2252,
    "name": "Zerouala",
    "wilaya_id": 22,
    "wilaya_name": "Sidi Bel Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2301,
    "name": "Annaba",
    "wilaya_id": 23,
    "wilaya_name": "Annaba",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2302,
    "name": "Berrahal",
    "wilaya_id": 23,
    "wilaya_name": "Annaba",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2303,
    "name": "El Hadjar",
    "wilaya_id": 23,
    "wilaya_name": "Annaba",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2304,
    "name": "Eulma",
    "wilaya_id": 23,
    "wilaya_name": "Annaba",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2305,
    "name": "El Bouni",
    "wilaya_id": 23,
    "wilaya_name": "Annaba",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2306,
    "name": "Oued El Aneb",
    "wilaya_id": 23,
    "wilaya_name": "Annaba",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2307,
    "name": "Cheurfa",
    "wilaya_id": 23,
    "wilaya_name": "Annaba",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2308,
    "name": "Seraïdi",
    "wilaya_id": 23,
    "wilaya_name": "Annaba",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2309,
    "name": "Aïn Berda",
    "wilaya_id": 23,
    "wilaya_name": "Annaba",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2310,
    "name": "Chetaïbi",
    "wilaya_id": 23,
    "wilaya_name": "Annaba",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2311,
    "name": "Sidi Amar",
    "wilaya_id": 23,
    "wilaya_name": "Annaba",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2312,
    "name": "Treat",
    "wilaya_id": 23,
    "wilaya_name": "Annaba",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2401,
    "name": "Aïn Ben Beida",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2402,
    "name": "Aïn Larbi",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2403,
    "name": "Aïn Makhlouf",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2404,
    "name": "Aïn Reggada",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2405,
    "name": "Aïn Sandel",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2406,
    "name": "Belkheir",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2407,
    "name": "Ben Djerrah",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2408,
    "name": "Beni Mezline",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2409,
    "name": "Bordj Sabath",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2410,
    "name": "Bouhachana",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2411,
    "name": "Bouhamdane",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2412,
    "name": "Bouati Mahmoud",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2413,
    "name": "Bouchegouf",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2414,
    "name": "Boumahra Ahmed",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2415,
    "name": "Dahouara",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2416,
    "name": "Djeballah Khemissi",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2417,
    "name": "El Fedjoudj",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2418,
    "name": "Guellat Bou Sbaa",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2419,
    "name": "Guelma",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2420,
    "name": "Hammam Debagh",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2421,
    "name": "Hammam N'Bail",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2422,
    "name": "Héliopolis",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2423,
    "name": "Houari Boumédiène",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2424,
    "name": "Khezarra",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2425,
    "name": "Medjez Amar",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2426,
    "name": "Medjez Sfa",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2427,
    "name": "Nechmaya",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2428,
    "name": "Oued Cheham",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2429,
    "name": "Oued Fragha",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2430,
    "name": "Oued Zenati",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2431,
    "name": "Ras El Agba",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2432,
    "name": "Roknia",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2433,
    "name": "Sellaoua Announa",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2434,
    "name": "Tamlouka",
    "wilaya_id": 24,
    "wilaya_name": "Guelma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2501,
    "name": "Aïn Abid",
    "wilaya_id": 25,
    "wilaya_name": "Constantine",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 2502,
    "name": "Aïn Smara",
    "wilaya_id": 25,
    "wilaya_name": "Constantine",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 2503,
    "name": "Beni Hamiden",
    "wilaya_id": 25,
    "wilaya_name": "Constantine",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 2504,
    "name": "Constantine",
    "wilaya_id": 25,
    "wilaya_name": "Constantine",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2505,
    "name": "Didouche Mourad",
    "wilaya_id": 25,
    "wilaya_name": "Constantine",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 2506,
    "name": "El Khroub",
    "wilaya_id": 25,
    "wilaya_name": "Constantine",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2507,
    "name": "Hamma Bouziane",
    "wilaya_id": 25,
    "wilaya_name": "Constantine",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 2508,
    "name": "Ibn Badis",
    "wilaya_id": 25,
    "wilaya_name": "Constantine",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 2509,
    "name": "Ibn Ziad",
    "wilaya_id": 25,
    "wilaya_name": "Constantine",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 2510,
    "name": "Messaoud Boudjriou",
    "wilaya_id": 25,
    "wilaya_name": "Constantine",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 2511,
    "name": "Ouled Rahmoune",
    "wilaya_id": 25,
    "wilaya_name": "Constantine",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 2512,
    "name": "Zighoud Youcef",
    "wilaya_id": 25,
    "wilaya_name": "Constantine",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 2601,
    "name": "Aïn Boucif",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2602,
    "name": "Aïn Ouksir",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2603,
    "name": "Aissaouia",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2604,
    "name": "Aziz",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2605,
    "name": "Baata",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2606,
    "name": "Benchicao",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2607,
    "name": "Beni Slimane",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2608,
    "name": "Berrouaghia",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2609,
    "name": "Bir Ben Laabed",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2610,
    "name": "Boghar",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2611,
    "name": "Bou Aiche",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2612,
    "name": "Bouaichoune",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2613,
    "name": "Bouchrahil",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2614,
    "name": "Boughezoul",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 2615,
    "name": "Bouskene",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2616,
    "name": "Chahbounia",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 2617,
    "name": "Chellalet El Adhaoura",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2618,
    "name": "Cheniguel",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2619,
    "name": "Derrag",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2620,
    "name": "Deux Bassins",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2621,
    "name": "Djouab",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2622,
    "name": "Draa Essamar",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2623,
    "name": "El Azizia",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 2624,
    "name": "El Guelb El Kebir",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2625,
    "name": "El Hamdania",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2626,
    "name": "El Omaria",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2627,
    "name": "El Ouinet",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2628,
    "name": "Hannacha",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2629,
    "name": "Kef Lakhdar",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2630,
    "name": "Khams Djouamaa",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2631,
    "name": "Ksar Boukhari",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2632,
    "name": "Meghraoua",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2633,
    "name": "Médéa",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2634,
    "name": "Moudjbar",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2635,
    "name": "Meftaha",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2636,
    "name": "Mezerana",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2637,
    "name": "Mihoub",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2638,
    "name": "Ouamri",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2639,
    "name": "Oued Harbil",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2640,
    "name": "Ouled Antar",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2641,
    "name": "Ouled Bouachra",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2642,
    "name": "Ouled Brahim",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2643,
    "name": "Ouled Deide",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2644,
    "name": "Ouled Hellal",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2645,
    "name": "Ouled Maaref",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2646,
    "name": "Oum El Djalil",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2647,
    "name": "Ouzera",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2648,
    "name": "Rebaia",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2649,
    "name": "Saneg",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2650,
    "name": "Sedraia",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2651,
    "name": "Seghouane",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2652,
    "name": "Si Mahdjoub",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2653,
    "name": "Sidi Damed",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2654,
    "name": "Sidi Errabia",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2655,
    "name": "Sidi Naamanez",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2656,
    "name": "Sidi Zahar",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2657,
    "name": "Sidi Ziane",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2658,
    "name": "Souagui",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2659,
    "name": "Tablat",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2660,
    "name": "Tafraout",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2661,
    "name": "Tamesguida",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2662,
    "name": "Tizi Mahdi",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2663,
    "name": "Tlatet Eddouar",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2664,
    "name": "Zoubiria",
    "wilaya_id": 26,
    "wilaya_name": "Médéa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2701,
    "name": "Abdelmalek Ramdane",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2702,
    "name": "Achaacha",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2703,
    "name": "Aïn Boudinar",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2704,
    "name": "Aïn Nouissy",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2705,
    "name": "Aïn Sidi Cherif",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2706,
    "name": "Aïn Tedles",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2707,
    "name": "Blad Touahria",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2708,
    "name": "Bouguirat",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2709,
    "name": "El Hassaine",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2710,
    "name": "Fornaka",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2711,
    "name": "Hadjadj",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2712,
    "name": "Hassi Mameche",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2713,
    "name": "Khadra",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2714,
    "name": "Kheireddine",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2715,
    "name": "Mansourah",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2716,
    "name": "Mesra",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2717,
    "name": "Mazagran",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2718,
    "name": "Mostaganem",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2719,
    "name": "Nekmaria",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2720,
    "name": "Oued El Kheir",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2721,
    "name": "Ouled Boughalem",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2722,
    "name": "Ouled Maallah",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2723,
    "name": "Safsaf",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2724,
    "name": "Sayada",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2725,
    "name": "Sidi Ali",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2726,
    "name": "Sidi Belattar",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2727,
    "name": "Sidi Lakhdar",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2728,
    "name": "Sirat",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 2729,
    "name": "Souaflia",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2730,
    "name": "Sour",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2731,
    "name": "Stidia",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2732,
    "name": "Tazgait",
    "wilaya_id": 27,
    "wilaya_name": "Mostaganem",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2801,
    "name": "Aïn El Hadjel",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2802,
    "name": "Aïn El Melh",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2803,
    "name": "Aïn Errich",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2804,
    "name": "Aïn Fares",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2805,
    "name": "Aïn Khadra",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2806,
    "name": "Belaiba",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2807,
    "name": "Ben Srour",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 2808,
    "name": "Beni Ilmane",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2809,
    "name": "Benzouh",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2810,
    "name": "Berhoum",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 2811,
    "name": "Bir Foda",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2812,
    "name": "Bou Saâda",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2813,
    "name": "Bouti Sayah",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2814,
    "name": "Chellal",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2815,
    "name": "Dehahna",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2816,
    "name": "Djebel Messaad",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2817,
    "name": "El Hamel",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2818,
    "name": "El Houamed",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2819,
    "name": "Hammam Dhalaa",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 2820,
    "name": "Khettouti Sed El Djir",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2821,
    "name": "Khoubana",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2822,
    "name": "Maadid",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2823,
    "name": "Maarif",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2824,
    "name": "Magra",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2825,
    "name": "M'Cif",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2826,
    "name": "Medjedel",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2827,
    "name": "Mohammed Boudiaf",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2828,
    "name": "M'Sila",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2829,
    "name": "M'Tarfa",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2830,
    "name": "Ouanougha",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2831,
    "name": "Ouled Addi Guebala",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2832,
    "name": "Ouled Atia",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2833,
    "name": "Ouled Derradj",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2834,
    "name": "Ouled Madhi",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2835,
    "name": "Ouled Mansour",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2836,
    "name": "Ouled Sidi Brahim",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2837,
    "name": "Ouled Slimane",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 2838,
    "name": "Oultem",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2839,
    "name": "Sidi Aïssa",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 2840,
    "name": "Sidi Ameur",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2841,
    "name": "Sidi Hadjeres",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2842,
    "name": "Sidi M'Hamed",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2843,
    "name": "Slim",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2844,
    "name": "Souamaa",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2845,
    "name": "Tamsa",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2846,
    "name": "Tarmount",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2847,
    "name": "Zarzour",
    "wilaya_id": 28,
    "wilaya_name": "M'Sila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2901,
    "name": "Aïn Fares",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2902,
    "name": "Aïn Fekan",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2903,
    "name": "Aïn Ferah",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2904,
    "name": "Aïn Fras",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2905,
    "name": "Alaïmia",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2906,
    "name": "Aouf",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2907,
    "name": "Beniane",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2908,
    "name": "Bou Hanifia",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2909,
    "name": "Bou Henni",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2910,
    "name": "Chorfa",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2911,
    "name": "El Bordj",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2912,
    "name": "El Gaada",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2913,
    "name": "El Ghomri",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2914,
    "name": "El Guettana",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2915,
    "name": "El Keurt",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2916,
    "name": "El Menaouer",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2917,
    "name": "Ferraguig",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2918,
    "name": "Froha",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2919,
    "name": "Gharrous",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2920,
    "name": "Guerdjoum",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2921,
    "name": "Ghriss",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2922,
    "name": "Hachem",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2923,
    "name": "Hacine",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2924,
    "name": "Khalouia",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2925,
    "name": "Makdha",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2926,
    "name": "Mamounia",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2927,
    "name": "Maoussa",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2928,
    "name": "Mascara",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2929,
    "name": "Matemore",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2930,
    "name": "Mocta Douz",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2931,
    "name": "Mohammadia",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2932,
    "name": "Nesmoth",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2933,
    "name": "Oggaz",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2934,
    "name": "Oued El Abtal",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2935,
    "name": "Oued Taria",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2936,
    "name": "Ras El Aïn Amirouche",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2937,
    "name": "Sedjerara",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2938,
    "name": "Sehailia",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2939,
    "name": "Sidi Abdeldjebar",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2940,
    "name": "Sidi Abdelmoumen",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2941,
    "name": "Sidi Kada",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2942,
    "name": "Sidi Boussaid",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2943,
    "name": "Sig",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2944,
    "name": "Tighennif",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2945,
    "name": "Tizi",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2946,
    "name": "Zahana",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 2947,
    "name": "Zelmata",
    "wilaya_id": 29,
    "wilaya_name": "Mascara",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3001,
    "name": "Aïn Beida",
    "wilaya_id": 30,
    "wilaya_name": "Ouargla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3007,
    "name": "Hassi Ben Abdellah",
    "wilaya_id": 30,
    "wilaya_name": "Ouargla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3008,
    "name": "Hassi Messaoud",
    "wilaya_id": 30,
    "wilaya_name": "Ouargla",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3012,
    "name": "N'Goussa",
    "wilaya_id": 30,
    "wilaya_name": "Ouargla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3013,
    "name": "Ouargla",
    "wilaya_id": 30,
    "wilaya_name": "Ouargla",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3014,
    "name": "Rouissat",
    "wilaya_id": 30,
    "wilaya_name": "Ouargla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3015,
    "name": "Sidi Khouiled",
    "wilaya_id": 30,
    "wilaya_name": "Ouargla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3101,
    "name": "Oran",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3102,
    "name": "Gdyel",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3103,
    "name": "Bir El Djir",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3104,
    "name": "Hassi Bounif",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3105,
    "name": "Es Senia",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3106,
    "name": "Arzew",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3107,
    "name": "Bethioua",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3108,
    "name": "Marsat El Hadjadj",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3109,
    "name": "Aïn El Turk",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3110,
    "name": "El Ançor",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3111,
    "name": "Oued Tlelat",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3112,
    "name": "Tafraoui",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3113,
    "name": "Sidi Chami",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3114,
    "name": "Boufatis",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3115,
    "name": "Mers El Kébir",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3116,
    "name": "Bou Sfer",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3117,
    "name": "El Kerma",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3118,
    "name": "El Braya",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3119,
    "name": "Hassi Ben Okba",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3120,
    "name": "Ben Freha",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3121,
    "name": "Hassi Mefsoukh",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3122,
    "name": "Sidi Benyebka",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3123,
    "name": "Misserghin",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3124,
    "name": "Boutlelis",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3125,
    "name": "Aïn El Kerma",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3126,
    "name": "Aïn El Bia",
    "wilaya_id": 31,
    "wilaya_name": "Oran",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3201,
    "name": "El Bayadh",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3202,
    "name": "Rogassa",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3203,
    "name": "Stitten",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3204,
    "name": "Brezina",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3205,
    "name": "Ghassoul",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3206,
    "name": "Boualem",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3207,
    "name": "El Abiodh Sidi Cheikh",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3208,
    "name": "Aïn El Orak",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3209,
    "name": "Arbaouat",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3210,
    "name": "Bougtoub",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3211,
    "name": "El Kheiter",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3212,
    "name": "Kef El Ahmar",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3213,
    "name": "Boussemghoun",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3214,
    "name": "Chellala",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3215,
    "name": "Kraakda",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3216,
    "name": "El Bnoud",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3217,
    "name": "Cheguig",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3218,
    "name": "Sidi Ameur",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3219,
    "name": "El Mehara",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3220,
    "name": "Tousmouline",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3221,
    "name": "Sidi Slimane",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3222,
    "name": "Sidi Tifour",
    "wilaya_id": 32,
    "wilaya_name": "El Bayadh",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 3301,
    "name": "Illizi",
    "wilaya_id": 33,
    "wilaya_name": "Illizi",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 15
  },
  {
    "id": 3303,
    "name": "Debdeb",
    "wilaya_id": 33,
    "wilaya_name": "Illizi",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 15
  },
  {
    "id": 3304,
    "name": "Bordj Omar Driss",
    "wilaya_id": 33,
    "wilaya_name": "Illizi",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 15
  },
  {
    "id": 3306,
    "name": "In Amenas",
    "wilaya_id": 33,
    "wilaya_name": "Illizi",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 15
  },
  {
    "id": 3401,
    "name": "Aïn Taghrout",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3402,
    "name": "Aïn Tesra",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3403,
    "name": "Belimour",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3404,
    "name": "Ben Daoud",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3405,
    "name": "Bir Kasdali",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3406,
    "name": "Bordj Bou Arreridj",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3407,
    "name": "Bordj Ghédir",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3408,
    "name": "Bordj Zemoura",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3409,
    "name": "Colla",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3410,
    "name": "Djaafra",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3411,
    "name": "El Ach",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3412,
    "name": "El Achir",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3413,
    "name": "El Anseur",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3414,
    "name": "El Hamadia",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3415,
    "name": "El Main",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3416,
    "name": "El M'hir",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3417,
    "name": "Ghilassa",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3418,
    "name": "Haraza",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3419,
    "name": "Hasnaoua",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3420,
    "name": "Khelil",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3421,
    "name": "Ksour",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3422,
    "name": "Mansoura",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3423,
    "name": "Medjana",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3424,
    "name": "Ouled Brahem",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3425,
    "name": "Ouled Dahmane",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3426,
    "name": "Ouled Sidi Brahim",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3427,
    "name": "Rabta",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3428,
    "name": "Ras El Oued",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3429,
    "name": "Sidi Embarek",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3430,
    "name": "Tefreg",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3431,
    "name": "Taglait",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3432,
    "name": "Teniet En Nasr",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3433,
    "name": "Tassameurt",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3434,
    "name": "Tixter",
    "wilaya_id": 34,
    "wilaya_name": "Bordj Bou Arreridj",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3501,
    "name": "Boumerdes",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3502,
    "name": "Boudouaou",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3504,
    "name": "Afir",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3505,
    "name": "Bordj Menaiel",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3506,
    "name": "Baghlia",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3507,
    "name": "Sidi Daoud",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3508,
    "name": "Naciria",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3509,
    "name": "Djinet",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3510,
    "name": "Issers",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3511,
    "name": "Zemmouri",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3512,
    "name": "Si Mustapha",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3513,
    "name": "Tidjelabine",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3514,
    "name": "Chabet el Ameur",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3515,
    "name": "Thenia",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3518,
    "name": "Timezrit",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3519,
    "name": "Corso",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3520,
    "name": "Ouled Moussa",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3521,
    "name": "Larbatache",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3522,
    "name": "Bouzegza Keddara",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3525,
    "name": "Taourga",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3526,
    "name": "Ouled Aissa",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3527,
    "name": "Ben Choud",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3528,
    "name": "Dellys",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3529,
    "name": "Ammal",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3530,
    "name": "Beni Amrane",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3531,
    "name": "Souk El Had",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3532,
    "name": "Boudouaou El Bahri",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3533,
    "name": "Ouled Hedadj",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3535,
    "name": "Leghata",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3536,
    "name": "Hammedi",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3537,
    "name": "Khemis El Khechna",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3538,
    "name": "El Kharrouba",
    "wilaya_id": 35,
    "wilaya_name": "Boumerdès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3601,
    "name": "Aïn El Assel",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3602,
    "name": "Aïn Kerma",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3603,
    "name": "Asfour",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3604,
    "name": "Ben Mehidi",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3605,
    "name": "Berrihane",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3606,
    "name": "Besbes",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3607,
    "name": "Bougous",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3608,
    "name": "Bouhadjar",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 3
  },
  {
    "id": 3609,
    "name": "Bouteldja",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3610,
    "name": "Chebaita Mokhtar",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3611,
    "name": "Chefia",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3612,
    "name": "Chihani",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3613,
    "name": "Dréan",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3614,
    "name": "Echatt",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3615,
    "name": "El Aioun",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3616,
    "name": "El Kala",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3617,
    "name": "El Tarf",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3618,
    "name": "Hammam Beni Salah",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3619,
    "name": "Lac des Oiseaux",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3620,
    "name": "Oued Zitoun",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3621,
    "name": "Raml Souk",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3622,
    "name": "Souarekh",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3623,
    "name": "Zerizer",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3624,
    "name": "Zitouna",
    "wilaya_id": 36,
    "wilaya_name": "El Tarf",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 3
  },
  {
    "id": 3701,
    "name": "Oum el Assel",
    "wilaya_id": 37,
    "wilaya_name": "Tindouf",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 5
  },
  {
    "id": 3702,
    "name": "Tindouf",
    "wilaya_id": 37,
    "wilaya_name": "Tindouf",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 5
  },
  {
    "id": 3801,
    "name": "Ammari",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 7,
    "delivery_time_payment": 2
  },
  {
    "id": 3802,
    "name": "Beni Chaib",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3803,
    "name": "Beni Lahcene",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3804,
    "name": "Boucaid",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 3805,
    "name": "Bordj Bou Naama",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 11,
    "delivery_time_payment": 2
  },
  {
    "id": 3806,
    "name": "Bordj El Emir Abdelkader",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 3807,
    "name": "Khemisti",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 3808,
    "name": "Larbaa",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 3809,
    "name": "Lardjem",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 9,
    "delivery_time_payment": 2
  },
  {
    "id": 3810,
    "name": "Layoune",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 9,
    "delivery_time_payment": 2
  },
  {
    "id": 3811,
    "name": "Lazharia",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 3812,
    "name": "Maacem",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3813,
    "name": "Melaab",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 14,
    "delivery_time_payment": 2
  },
  {
    "id": 3814,
    "name": "Ouled Bessem",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 3815,
    "name": "Sidi Abed",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 3816,
    "name": "Sidi Boutouchent",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 3817,
    "name": "Sidi Lantri",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 3818,
    "name": "Sidi Slimane",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 3819,
    "name": "Tamalaht",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3820,
    "name": "Theniet El Had",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 3821,
    "name": "Tissemsilt",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 3822,
    "name": "Youssoufia",
    "wilaya_id": 38,
    "wilaya_name": "Tissemsilt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 3901,
    "name": "El Oued",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 3902,
    "name": "Robbah",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3903,
    "name": "Oued El Alenda",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 3904,
    "name": "Bayadha",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3905,
    "name": "Nakhla",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3906,
    "name": "Guemar",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3907,
    "name": "Kouinine",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3908,
    "name": "Reguiba",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 3909,
    "name": "Hamraia",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3910,
    "name": "Taghzout",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3911,
    "name": "Debila",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3912,
    "name": "Hassani Abdelkrim",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3913,
    "name": "Hassi Khalifa",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 3914,
    "name": "Taleb Larbi",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3915,
    "name": "Douar El Ma",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3916,
    "name": "Sidi Aoun",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 3917,
    "name": "Trifaoui",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3918,
    "name": "Magrane",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 3919,
    "name": "Beni Guecha",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3920,
    "name": "Ourmas",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3925,
    "name": "El Ogla",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 3926,
    "name": "Mih Ouansa",
    "wilaya_id": 39,
    "wilaya_name": "El Oued",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 4001,
    "name": "Aïn Touila",
    "wilaya_id": 40,
    "wilaya_name": "Khenchela",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4002,
    "name": "Babar",
    "wilaya_id": 40,
    "wilaya_name": "Khenchela",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4003,
    "name": "Baghai",
    "wilaya_id": 40,
    "wilaya_name": "Khenchela",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4004,
    "name": "Bouhmama",
    "wilaya_id": 40,
    "wilaya_name": "Khenchela",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4005,
    "name": "Chechar",
    "wilaya_id": 40,
    "wilaya_name": "Khenchela",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4006,
    "name": "Chelia",
    "wilaya_id": 40,
    "wilaya_name": "Khenchela",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4007,
    "name": "Djellal",
    "wilaya_id": 40,
    "wilaya_name": "Khenchela",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4008,
    "name": "El Hamma",
    "wilaya_id": 40,
    "wilaya_name": "Khenchela",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4009,
    "name": "El Mahmal",
    "wilaya_id": 40,
    "wilaya_name": "Khenchela",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4010,
    "name": "El Oueldja",
    "wilaya_id": 40,
    "wilaya_name": "Khenchela",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4011,
    "name": "Ensigha",
    "wilaya_id": 40,
    "wilaya_name": "Khenchela",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4012,
    "name": "Kais",
    "wilaya_id": 40,
    "wilaya_name": "Khenchela",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4013,
    "name": "Khenchela",
    "wilaya_id": 40,
    "wilaya_name": "Khenchela",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4014,
    "name": "Khirane",
    "wilaya_id": 40,
    "wilaya_name": "Khenchela",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4015,
    "name": "M'Sara",
    "wilaya_id": 40,
    "wilaya_name": "Khenchela",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4016,
    "name": "M'Toussa",
    "wilaya_id": 40,
    "wilaya_name": "Khenchela",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4017,
    "name": "Ouled Rechache",
    "wilaya_id": 40,
    "wilaya_name": "Khenchela",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4018,
    "name": "Remila",
    "wilaya_id": 40,
    "wilaya_name": "Khenchela",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4019,
    "name": "Tamza",
    "wilaya_id": 40,
    "wilaya_name": "Khenchela",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4020,
    "name": "Taouzient",
    "wilaya_id": 40,
    "wilaya_name": "Khenchela",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4021,
    "name": "Yabous",
    "wilaya_id": 40,
    "wilaya_name": "Khenchela",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4101,
    "name": "Souk Ahras",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4102,
    "name": "Sedrata",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4103,
    "name": "Hanancha",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4104,
    "name": "Mechroha",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4105,
    "name": "Ouled Driss",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4106,
    "name": "Tiffech",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4107,
    "name": "Zaarouria",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4108,
    "name": "Taoura",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4109,
    "name": "Drea",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4110,
    "name": "Heddada",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4111,
    "name": "Khedara",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4112,
    "name": "Merahna",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4113,
    "name": "Ouled Moumene",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4114,
    "name": "Bir Bou Haouch",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4115,
    "name": "M'daourouch",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4116,
    "name": "Oum El Adhaim",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4117,
    "name": "Aïn Zana",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4118,
    "name": "Aïn Soltane",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4119,
    "name": "Ouillen",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4120,
    "name": "Sidi Fredj",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4121,
    "name": "Safel El Ouiden",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4122,
    "name": "Ragouba",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4123,
    "name": "Khemissa",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4124,
    "name": "Oued Keberit",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4125,
    "name": "Terraguelt",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4126,
    "name": "Zouabi",
    "wilaya_id": 41,
    "wilaya_name": "Souk Ahras",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 3
  },
  {
    "id": 4201,
    "name": "Tipaza",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4202,
    "name": "Menaceur",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4203,
    "name": "Larhat",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4204,
    "name": "Douaouda",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4205,
    "name": "Bourkika",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4206,
    "name": "Khemisti",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4210,
    "name": "Aghbal",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4212,
    "name": "Hadjout",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4213,
    "name": "Sidi Amar",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4214,
    "name": "Gouraya",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 4215,
    "name": "Nador",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4216,
    "name": "Chaiba",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4217,
    "name": "Aïn Tagourait",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4222,
    "name": "Cherchell",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 4223,
    "name": "Damous",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4224,
    "name": "Merad",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4225,
    "name": "Fouka",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4226,
    "name": "Bou Ismaïl",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4227,
    "name": "Ahmar El Aïn",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 4230,
    "name": "Bouharoun",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4232,
    "name": "Sidi Ghiles",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 4233,
    "name": "Messelmoun",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4234,
    "name": "Sidi Rached",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4235,
    "name": "Koléa",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4236,
    "name": "Attatba",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 4240,
    "name": "Sidi Semiane",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4241,
    "name": "Beni Milleuk",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 0,
    "delivery_time_payment": 0
  },
  {
    "id": 4242,
    "name": "Hadjeret Ennous",
    "wilaya_id": 42,
    "wilaya_name": "Tipaza",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 4301,
    "name": "Ahmed Rachedi",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4302,
    "name": "Aïn Beida Harriche",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4303,
    "name": "Aïn Mellouk",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4304,
    "name": "Aïn Tine",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4305,
    "name": "Amira Arrès",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4306,
    "name": "Benyahia Abderrahmane",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4307,
    "name": "Bouhatem",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4308,
    "name": "Chelghoum Laid",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4309,
    "name": "Chigara",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4310,
    "name": "Derradji Bousselah",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4311,
    "name": "El Mechira",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4312,
    "name": "Elayadi Barbes",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4313,
    "name": "Ferdjioua",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4314,
    "name": "Grarem Gouga",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4315,
    "name": "Hamala",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4316,
    "name": "Mila",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4317,
    "name": "Minar Zarza",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4318,
    "name": "Oued Athmania",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4319,
    "name": "Oued Endja",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4320,
    "name": "Oued Seguen",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4321,
    "name": "Ouled Khalouf",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4322,
    "name": "Rouached",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4323,
    "name": "Sidi Khelifa",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4324,
    "name": "Sidi Merouane",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4325,
    "name": "Tadjenanet",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4326,
    "name": "Tassadane Haddada",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4327,
    "name": "Teleghma",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4328,
    "name": "Terrai Bainen",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4329,
    "name": "Tessala Lemtaï",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4330,
    "name": "Tiberguent",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4331,
    "name": "Yahia Beni Guecha",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4332,
    "name": "Zeghaia",
    "wilaya_id": 43,
    "wilaya_name": "Mila",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 2
  },
  {
    "id": 4401,
    "name": "Aïn Defla",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4402,
    "name": "Aïn Bouyahia",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4403,
    "name": "Aïn Benian",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4404,
    "name": "Aïn Lechiekh",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4405,
    "name": "Aïn Soltane",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4406,
    "name": "Aïn Torki",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4407,
    "name": "Arib",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4408,
    "name": "Bathia",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4409,
    "name": "Belaas",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4410,
    "name": "Ben Allal",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4411,
    "name": "Birbouche",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4412,
    "name": "Bir Ould Khelifa",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4413,
    "name": "Bordj Emir Khaled",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4414,
    "name": "Boumedfaa",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4415,
    "name": "Bourached",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4416,
    "name": "Djelida",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4417,
    "name": "Djemaa Ouled Cheikh",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4418,
    "name": "Djendel",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4419,
    "name": "El Abadia",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4420,
    "name": "El Amra",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4421,
    "name": "El Attaf",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4422,
    "name": "El Hassania",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4423,
    "name": "El Maine",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4424,
    "name": "Hammam Righa",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4425,
    "name": "Hoceinia",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4426,
    "name": "Khemis Miliana",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4427,
    "name": "Mekhatria",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4428,
    "name": "Miliana",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4429,
    "name": "Oued Chorfa",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4430,
    "name": "Oued Djemaa",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4431,
    "name": "Rouina",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4432,
    "name": "Sidi Lakhdar",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4433,
    "name": "Tacheta Zougagha",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4434,
    "name": "Tarik Ibn Ziad",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4435,
    "name": "Tiberkanine",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4436,
    "name": "Zeddine",
    "wilaya_id": 44,
    "wilaya_name": "Aïn Defla",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4501,
    "name": "Naâma",
    "wilaya_id": 45,
    "wilaya_name": "Naâma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 4502,
    "name": "Mecheria",
    "wilaya_id": 45,
    "wilaya_name": "Naâma",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 4503,
    "name": "Aïn Sefra",
    "wilaya_id": 45,
    "wilaya_name": "Naâma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 5
  },
  {
    "id": 4504,
    "name": "Tiout",
    "wilaya_id": 45,
    "wilaya_name": "Naâma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 4505,
    "name": "Sfissifa",
    "wilaya_id": 45,
    "wilaya_name": "Naâma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 4506,
    "name": "Moghrar",
    "wilaya_id": 45,
    "wilaya_name": "Naâma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 0,
    "delivery_time_payment": 5
  },
  {
    "id": 4507,
    "name": "Assela",
    "wilaya_id": 45,
    "wilaya_name": "Naâma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 4508,
    "name": "Djeniene Bourezg",
    "wilaya_id": 45,
    "wilaya_name": "Naâma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 0,
    "delivery_time_payment": 5
  },
  {
    "id": 4509,
    "name": "Aïn Ben Khelil",
    "wilaya_id": 45,
    "wilaya_name": "Naâma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 4510,
    "name": "Makman Ben Amer",
    "wilaya_id": 45,
    "wilaya_name": "Naâma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 0,
    "delivery_time_payment": 5
  },
  {
    "id": 4511,
    "name": "Kasdir",
    "wilaya_id": 45,
    "wilaya_name": "Naâma",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 4512,
    "name": "El Biod",
    "wilaya_id": 45,
    "wilaya_name": "Naâma",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 4601,
    "name": "Aghlal",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 4602,
    "name": "Aïn El Arbaa",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 4603,
    "name": "Aïn Kihal",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 4604,
    "name": "Aïn Témouchent",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4605,
    "name": "Aïn Tolba",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4606,
    "name": "Aoubellil",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 4607,
    "name": "Beni Saf",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4608,
    "name": "Bouzedjar",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 4609,
    "name": "Chaabat El Leham",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4610,
    "name": "Chentouf",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4611,
    "name": "El Amria",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 4612,
    "name": "El Emir Abdelkader",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4613,
    "name": "El Malah",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4614,
    "name": "El Messaid",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 4615,
    "name": "Hammam Bouhadjar",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4616,
    "name": "Hassasna",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 4617,
    "name": "Hassi El Ghella",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 4618,
    "name": "Oued Berkeche",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 4619,
    "name": "Oued Sabah",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 4620,
    "name": "Ouled Boudjemaa",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 0,
    "delivery_time_payment": 2
  },
  {
    "id": 4621,
    "name": "Ouled Kihal",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4622,
    "name": "Oulhaça El Gheraba",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 0,
    "delivery_time_payment": 2
  },
  {
    "id": 4623,
    "name": "Sidi Ben Adda",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4624,
    "name": "Sidi Boumedienne",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 0,
    "delivery_time_payment": 2
  },
  {
    "id": 4625,
    "name": "Sidi Ouriache",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 0,
    "delivery_time_payment": 2
  },
  {
    "id": 4626,
    "name": "Sidi Safi",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 4627,
    "name": "Tamzoura",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 4628,
    "name": "Terga",
    "wilaya_id": 46,
    "wilaya_name": "Aïn Témouchent",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4701,
    "name": "Berriane",
    "wilaya_id": 47,
    "wilaya_name": "Ghardaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 10
  },
  {
    "id": 4702,
    "name": "Bounoura",
    "wilaya_id": 47,
    "wilaya_name": "Ghardaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 10
  },
  {
    "id": 4703,
    "name": "Dhayet Bendhahoua",
    "wilaya_id": 47,
    "wilaya_name": "Ghardaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 10
  },
  {
    "id": 4704,
    "name": "El Atteuf",
    "wilaya_id": 47,
    "wilaya_name": "Ghardaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 10
  },
  {
    "id": 4705,
    "name": "El Guerrara",
    "wilaya_id": 47,
    "wilaya_name": "Ghardaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 20,
    "delivery_time_payment": 10
  },
  {
    "id": 4707,
    "name": "Ghardaïa",
    "wilaya_id": 47,
    "wilaya_name": "Ghardaïa",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 10
  },
  {
    "id": 4710,
    "name": "Mansoura",
    "wilaya_id": 47,
    "wilaya_name": "Ghardaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 20,
    "delivery_time_payment": 10
  },
  {
    "id": 4711,
    "name": "Metlili",
    "wilaya_id": 47,
    "wilaya_name": "Ghardaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 20,
    "delivery_time_payment": 10
  },
  {
    "id": 4712,
    "name": "Sebseb",
    "wilaya_id": 47,
    "wilaya_name": "Ghardaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 20,
    "delivery_time_payment": 10
  },
  {
    "id": 4713,
    "name": "Zelfana",
    "wilaya_id": 47,
    "wilaya_name": "Ghardaïa",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 20,
    "delivery_time_payment": 10
  },
  {
    "id": 4801,
    "name": "Aïn Rahma",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4802,
    "name": "Aïn Tarek",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4803,
    "name": "Ammi Moussa",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 13,
    "delivery_time_payment": 2
  },
  {
    "id": 4804,
    "name": "Belassel Bouzegza",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4805,
    "name": "Bendaoud",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4806,
    "name": "Beni Dergoun",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4807,
    "name": "Beni Zentis",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4808,
    "name": "Dar Ben Abdellah",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4809,
    "name": "Djidioua",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4810,
    "name": "El Guettar",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4811,
    "name": "El Hamadna",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4812,
    "name": "El Hassi",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4813,
    "name": "El Matmar",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4814,
    "name": "El Ouldja",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4815,
    "name": "Had Echkalla",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4816,
    "name": "Hamri",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4817,
    "name": "Kalaa",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4818,
    "name": "Lahlef",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4819,
    "name": "Mazouna",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 13,
    "delivery_time_payment": 2
  },
  {
    "id": 4820,
    "name": "Mediouna",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4821,
    "name": "Mendes",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4822,
    "name": "Merdja Sidi Abed",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4823,
    "name": "Ouarizane",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4824,
    "name": "Oued Essalem",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4825,
    "name": "Oued Rhiou",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4826,
    "name": "Ouled Aiche",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4827,
    "name": "Oued El Djemaa",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4828,
    "name": "Ouled Sidi Mihoub",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4829,
    "name": "Ramka",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4830,
    "name": "Relizane",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4831,
    "name": "Sidi Khettab",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4832,
    "name": "Sidi Lazreg",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4833,
    "name": "Sidi M'Hamed Ben Ali",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4834,
    "name": "Sidi M'Hamed Benaouda",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4835,
    "name": "Sidi Saada",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4836,
    "name": "Souk El Had",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4837,
    "name": "Yellel",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4838,
    "name": "Zemmora",
    "wilaya_id": 48,
    "wilaya_name": "Relizane",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 8,
    "delivery_time_payment": 2
  },
  {
    "id": 4903,
    "name": "Charouine",
    "wilaya_id": 49,
    "wilaya_name": "Timimoun",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 4907,
    "name": "Ksar Kaddour",
    "wilaya_id": 49,
    "wilaya_name": "Timimoun",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 4909,
    "name": "Timimoun",
    "wilaya_id": 49,
    "wilaya_name": "Timimoun",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 4910,
    "name": "Ouled Saïd",
    "wilaya_id": 49,
    "wilaya_name": "Timimoun",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 4916,
    "name": "Tinerkouk",
    "wilaya_id": 49,
    "wilaya_name": "Timimoun",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 4917,
    "name": "Deldoul",
    "wilaya_id": 49,
    "wilaya_name": "Timimoun",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 4920,
    "name": "Metarfa",
    "wilaya_id": 49,
    "wilaya_name": "Timimoun",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 15
  },
  {
    "id": 4923,
    "name": "Aougrout",
    "wilaya_id": 49,
    "wilaya_name": "Timimoun",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 4924,
    "name": "Talmine",
    "wilaya_id": 49,
    "wilaya_name": "Timimoun",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 4927,
    "name": "Ouled Aïssa",
    "wilaya_id": 49,
    "wilaya_name": "Timimoun",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 5
  },
  {
    "id": 5025,
    "name": "Bordj Badji Mokhtar",
    "wilaya_id": 50,
    "wilaya_name": "Bordj Badji Mokhtar",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 25,
    "delivery_time_payment": 10
  },
  {
    "id": 5028,
    "name": "Timiaouine",
    "wilaya_id": 50,
    "wilaya_name": "Bordj Badji Mokhtar",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 25,
    "delivery_time_payment": 15
  },
  {
    "id": 5103,
    "name": "Besbes",
    "wilaya_id": 51,
    "wilaya_name": "Ouled Djellal",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 5110,
    "name": "Doucen",
    "wilaya_id": 51,
    "wilaya_name": "Ouled Djellal",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 5111,
    "name": "Ech Chaïba",
    "wilaya_id": 51,
    "wilaya_name": "Ouled Djellal",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 5126,
    "name": "Ouled Djellal",
    "wilaya_id": 51,
    "wilaya_name": "Ouled Djellal",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 12,
    "delivery_time_payment": 2
  },
  {
    "id": 5129,
    "name": "Ras El Miaad",
    "wilaya_id": 51,
    "wilaya_name": "Ouled Djellal",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 2
  },
  {
    "id": 5130,
    "name": "Sidi Khaled",
    "wilaya_id": 51,
    "wilaya_name": "Ouled Djellal",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 12,
    "delivery_time_payment": 2
  },
  {
    "id": 5203,
    "name": "Ouled Khoudir",
    "wilaya_id": 52,
    "wilaya_name": "Béni Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 10
  },
  {
    "id": 5205,
    "name": "Timoudi",
    "wilaya_id": 52,
    "wilaya_name": "Béni Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 15
  },
  {
    "id": 5207,
    "name": "Béni Abbès",
    "wilaya_id": 52,
    "wilaya_name": "Béni Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 10
  },
  {
    "id": 5208,
    "name": "Beni Ikhlef",
    "wilaya_id": 52,
    "wilaya_name": "Béni Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 10
  },
  {
    "id": 5211,
    "name": "Igli",
    "wilaya_id": 52,
    "wilaya_name": "Béni Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 10
  },
  {
    "id": 5212,
    "name": "Tabelbala",
    "wilaya_id": 52,
    "wilaya_name": "Béni Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 15
  },
  {
    "id": 5214,
    "name": "El Ouata",
    "wilaya_id": 52,
    "wilaya_name": "Béni Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 10
  },
  {
    "id": 5218,
    "name": "Kerzaz",
    "wilaya_id": 52,
    "wilaya_name": "Béni Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 10
  },
  {
    "id": 5219,
    "name": "Ksabi",
    "wilaya_id": 52,
    "wilaya_name": "Béni Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 15
  },
  {
    "id": 5220,
    "name": "Tamtert",
    "wilaya_id": 52,
    "wilaya_name": "Béni Abbès",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 15
  },
  {
    "id": 5303,
    "name": "In Ghar",
    "wilaya_id": 53,
    "wilaya_name": "In Salah",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 5
  },
  {
    "id": 5308,
    "name": "In Salah",
    "wilaya_id": 53,
    "wilaya_name": "In Salah",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 15,
    "delivery_time_payment": 10
  },
  {
    "id": 5310,
    "name": "Foggaret Ezzaouia",
    "wilaya_id": 53,
    "wilaya_name": "In Salah",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 5
  },
  {
    "id": 5404,
    "name": "In Guezzam",
    "wilaya_id": 54,
    "wilaya_name": "In Guezzam",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 5
  },
  {
    "id": 5407,
    "name": "Tin Zaouatine",
    "wilaya_id": 54,
    "wilaya_name": "In Guezzam",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 5
  },
  {
    "id": 5502,
    "name": "Benaceur",
    "wilaya_id": 55,
    "wilaya_name": "Touggourt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 5503,
    "name": "Blidet Amor",
    "wilaya_id": 55,
    "wilaya_name": "Touggourt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 5504,
    "name": "El Allia",
    "wilaya_id": 55,
    "wilaya_name": "Touggourt",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 5505,
    "name": "El Borma",
    "wilaya_id": 55,
    "wilaya_name": "Touggourt",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 5506,
    "name": "El Hadjira",
    "wilaya_id": 55,
    "wilaya_name": "Touggourt",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 5509,
    "name": "Megarine",
    "wilaya_id": 55,
    "wilaya_name": "Touggourt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 5510,
    "name": "M'Naguer",
    "wilaya_id": 55,
    "wilaya_name": "Touggourt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 5511,
    "name": "Nezla",
    "wilaya_id": 55,
    "wilaya_name": "Touggourt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 5516,
    "name": "Sidi Slimane",
    "wilaya_id": 55,
    "wilaya_name": "Touggourt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 5517,
    "name": "Taibet",
    "wilaya_id": 55,
    "wilaya_name": "Touggourt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 5518,
    "name": "Tamacine",
    "wilaya_id": 55,
    "wilaya_name": "Touggourt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 5519,
    "name": "Tebesbest",
    "wilaya_id": 55,
    "wilaya_name": "Touggourt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 5520,
    "name": "Touggourt",
    "wilaya_id": 55,
    "wilaya_name": "Touggourt",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 5521,
    "name": "Zaouia El Abidia",
    "wilaya_id": 55,
    "wilaya_name": "Touggourt",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 5602,
    "name": "Djanet",
    "wilaya_id": 56,
    "wilaya_name": "Djanet",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 15
  },
  {
    "id": 5605,
    "name": "Bordj El Haouas",
    "wilaya_id": 56,
    "wilaya_name": "Djanet",
    "has_stop_desk": 0,
    "is_deliverable": 0,
    "delivery_time_parcel": 5,
    "delivery_time_payment": 15
  },
  {
    "id": 5721,
    "name": "Still",
    "wilaya_id": 57,
    "wilaya_name": "El M'Ghair",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 3
  },
  {
    "id": 5722,
    "name": "M'Rara",
    "wilaya_id": 57,
    "wilaya_name": "El M'Ghair",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 3
  },
  {
    "id": 5723,
    "name": "Sidi Khellil",
    "wilaya_id": 57,
    "wilaya_name": "El M'Ghair",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 3
  },
  {
    "id": 5724,
    "name": "Tendla",
    "wilaya_id": 57,
    "wilaya_name": "El M'Ghair",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 3
  },
  {
    "id": 5727,
    "name": "El M'Ghair",
    "wilaya_id": 57,
    "wilaya_name": "El M'Ghair",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 5728,
    "name": "Djamaa",
    "wilaya_id": 57,
    "wilaya_name": "El M'Ghair",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 2
  },
  {
    "id": 5729,
    "name": "Oum Touyour",
    "wilaya_id": 57,
    "wilaya_name": "El M'Ghair",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 3
  },
  {
    "id": 5730,
    "name": "Sidi Amrane",
    "wilaya_id": 57,
    "wilaya_name": "El M'Ghair",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 10,
    "delivery_time_payment": 3
  },
  {
    "id": 5806,
    "name": "El Menia",
    "wilaya_id": 58,
    "wilaya_name": "El Menia",
    "has_stop_desk": 1,
    "is_deliverable": 1,
    "delivery_time_parcel": 20,
    "delivery_time_payment": 10
  },
  {
    "id": 5808,
    "name": "Hassi Fehal",
    "wilaya_id": 58,
    "wilaya_name": "El Menia",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 20,
    "delivery_time_payment": 10
  },
  {
    "id": 5809,
    "name": "Hassi Gara",
    "wilaya_id": 58,
    "wilaya_name": "El Menia",
    "has_stop_desk": 0,
    "is_deliverable": 1,
    "delivery_time_parcel": 20,
    "delivery_time_payment": 10
  }
]
// Product Data Object
const productDataa = {
  title: "Spring Summer ice Silk Straight Leg Pants",
  titleArabic: "بنطلون حريري مستقيم للربيع والصيف",
  breadcrumb: "هذا المنتج يتم بيع مرة",
  price: {
    current: "3,200.00 د.ج",
    original: "4,500.00 د.ج",
    discount: "40%",
  },
  rating: {
    stars: 0,
    count: "0.00",
  },
  stock: {
    available: false,
    message: "غير متوفر",
  },
  options: {
    size: "M",
    color: "Noir",
    quantity: 1,
  },
  form: {
    phoneLabel: "رقم الهاتف",
    nameLabel: "الاسم الكامل",
    wilayaLabel: "الولاية",
    communeLabel: "البلدية",
    orderInstructions: "لإجراء طلب، يرجى إدخال التفاصيل:",
    validation: {
      nameRequired: "الاسم مطلوب",
      phoneRequired: "رقم الهاتف مطلوب",
      phoneInvalid: "رقم الهاتف غير صحيح (يجب أن يبدأ بـ 05، 06، 07، 2135، 2136، أو 2137)",
      wilayaRequired: "الولاية مطلوبة",
      communeRequired: "البلدية مطلوبة",
    },
  },
  buttons: {
    orderNow: "اشتر الآن - دفع عند الاستلام",
    getItNow: "احصل عليه الآن",
    login: "تسجيل دخول",
  },
  shipping: {
    freeShipping: "الشحن مجاني",
    freeShippingDesc: "لجميع أنحاء الجزائر",
    returnPolicy: "استرداد خلال 30 يوم",
    returnPolicyDesc: "ضمان استرداد الأموال",
  },
  navigation: {
    account: "حسابك",
    login: "دخول",
    about: "عن",
  },
  tabs: {
    return: {
      label: "إرجاع",
      content: "يمكنك إرجاع المنتج خلال 30 يوم من تاريخ الاستلام مع ضمان استرداد كامل للمبلغ.",
    },
    shipping: {
      label: "الشحن",
      content: "شحن مجاني لجميع أنحاء الجزائر. التسليم خلال 2-5 أيام عمل.",
    },
    guarantee: {
      label: "ضمان",
      content:
        "ضمان استرداد أو استبدال مؤكد. هذا يعني أنك لست مضطر أو تغيير. مجرد أن يصل إليك الطرد الخاصة بك لتقييم جودته.",
    },
  },
  additionalInfo:
    "لقد تمت تجربة إرجاع سهلة بما فيه الكفاية والمشاكل والمشاكل في حالة أي إرجاع أو تغيير. منتج ليس بما جاء يؤدي بما اشتراك خلافة ويمكن بحماية استرداد مؤكد.",
  promotion: {
title: "عرض محدود! خصم 20%",
description: "الكمية محدودة، سارع بالطلب قبل انتهاء العرض!",
guarantee: "ضمان مؤكد على المنتج"
  },
  discountTimer: {
    message: "خصم خاص ينتهي خلال:",
    labels: {
      days: "يوم",
      hours: "ساعة",
      minutes: "دقيقة",
      seconds: "ثانية",
    },
  },
  testimonials: {
    title: "صور العملاء",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/tullin-ecce0.firebasestorage.app/o/testimonials%2FWhatsApp%20Image%202025-07-01%20at%208.18.25%20PM.jpeg?alt=media&token=f4675141-096b-4490-803f-5120c9ab301c",
      "https://firebasestorage.googleapis.com/v0/b/tullin-ecce0.firebasestorage.app/o/testimonials%2FWhatsApp%20Image%202025-07-01%20at%208.18.25%20PM%20(1).jpeg?alt=media&token=c6dc9dde-387d-4f89-8ec9-56294a99e643",
      "https://firebasestorage.googleapis.com/v0/b/tullin-ecce0.firebasestorage.app/o/testimonials%2FWhatsApp%20Image%202025-07-01%20at%208.18.26%20PM.jpeg?alt=media&token=f232cc19-f25c-431d-a78c-22a84a245e66",
      "https://firebasestorage.googleapis.com/v0/b/tullin-ecce0.firebasestorage.app/o/testimonials%2FWhatsApp%20Image%202025-07-01%20at%208.18.28%20PM.jpeg?alt=media&token=baba4adb-bc53-4c13-8c77-56b7d261b510",
    ],
  },
  productImages: [
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
  ],
}

export default function ProductPage() {
  const { productData, loading, error } = useProduct()
  const thumbnailContainerRef = useRef(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomedImage, setZoomedImage] = useState("")
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedCommune, setSelectedCommune] = useState("")
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<string | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
   const [isSubmitting, setIsSubmitting] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [deliveryPrices, setDeliveryPrices] = useState<{ [key: string]: number }>({});
  const [isOrderSheetOpen, setIsOrderSheetOpen] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

const router = useRouter();
const [lastSubmitTime, setLastSubmitTime] = useState<number | null>(null);
const [activeTab, setActiveTab] = useState("guarantee")
const [timeLeft, setTimeLeft] = useState({
  days: 2,
  hours: 15,
  minutes: 51,
  seconds: 54,
})
const [errors, setErrors] = useState({
  name: "",
  phone: "",
  wilaya: "",
  commune: "",
})


const sizeOptions = useMemo(() => {
  if (!productData?.options || productData.options.length === 0) {
    return ["37", "38", "39", "40", "41"];
  }

  const colorKeywords = ["noir", "blanc", "bleu", "rouge", "vert", "jaune", "orange", "gris", "rose", "marron"];

  const isColorOption = (option: { name: string; values: string[] }) => {
    const nameLower = option.name.toLowerCase();
    if (nameLower.includes("couleur") || nameLower.includes("color")) return true;

    return option.values.some(value =>
      colorKeywords.some(keyword =>
        value.toLowerCase().includes(keyword)
      )
    );
  };

  const sizeOption = productData.options.find(option => !isColorOption(option));

  return sizeOption?.values || ["37", "38", "39", "40", "41"];
}, [productData]);
useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev.seconds > 0) {
        return { ...prev, seconds: prev.seconds - 1 }
      } else if (prev.minutes > 0) {
        return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
      } else if (prev.hours > 0) {
        return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
      } else if (prev.days > 0) {
        return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
      }
      return prev
    })
  }, 1000)

  return () => clearInterval(timer)
}, [])
  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta))
  }
useEffect(() => {
  if (!productData) return;

  const colorKeywords = ["noir", "blanc", "bleu", "rouge", "vert", "jaune", "orange", "gris", "rose", "marron"];

  const isColor = (value: string) => 
    colorKeywords.some(keyword => value.toLowerCase().includes(keyword));

  const firstVariant = productData.variants?.[0];

  let size = "";
  let color = "";

  if (firstVariant) {
    const { option1, option2 } = firstVariant;

    if (isColor(option1)) {
      color = option1;
      size = option2;
    } else if (isColor(option2)) {
      color = option2;
      size = option1;
    } else {
      // Fallback if no color detected
      size = option1;
      color = option2;
    }
  }

  setSelectedSize(size);
  setSelectedColor(color);
  setSelectedDeliveryMethod("domicile");
}, [productData]);
useEffect(() => {
  const fetchDeliveryPrices = async () => {
    if (!selectedProvince) return;
const wilayaId = selectedProvince.toString().padStart(2, "0");

    try {
      const docRef = doc(firestore, "deliveryPrices", wilayaId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDeliveryPrices(docSnap.data() as { [key: string]: number });
      } else {
        console.warn("No delivery price found for wilaya", selectedProvince);
        setDeliveryPrices({});
      }
    } catch (error) {
      console.error("Failed to fetch delivery prices", error);
    }
  };

  fetchDeliveryPrices();
}, [selectedProvince]);
  if (loading) {
    return <Loading />
  }

  if (error || !productData) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error || "Could not load product data."}
      </div>
    )
  }
const currentColorObj =
  productData.colorImages.find((color: any) =>
    color.color === selectedColor
  ) ||
  productData.variants.find(
    (variant: any) =>
      variant.option1 === selectedColor || variant.option2 === selectedColor
  );

 const productTotal = productData.priceAfter * quantity
  const shippingCost = deliveryPrices[selectedDeliveryMethod]|| 0
  const grandTotal = productTotal + shippingCost

  const handleImageZoom = (imageSrc: string) => {
    setZoomedImage(imageSrc)
    setIsZoomed(true)
  }



function convertShopifyOrderToCustomFormat(data) {

  const wilaya = selectedProvince;
  const convertedOrder = {
    id: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
    date: new Date().toISOString().split('T')[0],
    name: data.name || "",
    phone: data.phone,
    articles: [],
    wilaya: wilaya|| "",
    commune: selectedCommune|| "",
    deliveryType:selectedDeliveryMethod==="domicile" ?"domicile":"stopdesk", // Default value as per shipping method
    deliveryCompany: "", // Not available in Shopify data
    deliveryCenter:"", // Not available in Shopify data
    confirmationStatus: "En attente", // Default status
    pickupPoint: "",
    status: "en-attente",
    deliveryPrice:deliveryPrices[selectedDeliveryMethod] || 0,
    address: `wilaya: ${wilaya}, commune: ${selectedCommune}`,
    additionalInfo:  "",
    confirmatrice: "", // Not available in Shopify data
    totalPrice: `${grandTotal} DZ`,
    source: productData.boutiqueName || "landing-page",
    statusHistory: [
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Process line items (articles)
const matchingArticle = productData.variants.find((article: any) => {
  return (
    (article.option1 === selectedSize || article.option1 === selectedColor) &&
    (article.option2 === selectedSize || article.option2 === selectedColor)
  )
})
      const variantTitle = matchingArticle.title || "";
      const variantParts = variantTitle.split(" / ");
      
      const article = {
        product_id: productData.productId,
        product_name: productData.productTitle,
        variant_id: matchingArticle.id,
        variant_title: matchingArticle.title,
        variant_options: {
    option1: variantParts[0] ?? null,
  option2: variantParts[1] ?? null,
        },
        quantity: quantity,
        unit_price: productData.priceAfter,
        product_sku: productData.productTitle || "",
        variant_sku: matchingArticle.sku || ""
      };
      
      convertedOrder.articles.push(article);


  return convertedOrder;
}

// Utility to generate a reference string
function generateReferenceFromDepots(depots) {
  if (!Array.isArray(depots) || depots.length === 0) return "";

  const allSameDepot = depots.every((d) => d.id === depots[0].id);
  let prefix = allSameDepot
    ? (depots[0].name || "DEPOT").substring(0, 5).toUpperCase()
    : "DEPOTD";

  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString().substring(9, 13);

  return `${prefix}-${randomStr}${timestamp}`;
}


  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
      if (lastSubmitTime && Date.now() - lastSubmitTime < 40000) {
    alert("يرجى الانتظار قليلاً قبل إعادة المحاولة.");
    return;
  }
     const isValid =
    name.trim() !== "" &&
    phone.trim() !== "" &&
    selectedProvince !== "" &&
    selectedCommune !== "" &&
    selectedDeliveryMethod !== "" &&
    selectedColor !== "" &&
    selectedSize !== "" &&
    quantity > 0;

  if (!isValid) {
    alert("يرجى ملء جميع الحقول المطلوبة بشكل صحيح.");
    return;
  }

        setIsSubmitting(true)
          setLastSubmitTime(Date.now()); // 🔐 Set lock timestamp
  const form = e.currentTarget
  

try {
  const orderData = convertShopifyOrderToCustomFormat({ name, phone })
  let order=orderData
    const normalizedPhone = order.phone?.trim();


// 🔁 Check for duplicate orders
const ordersRef = collection(firestore, "orders");
const duplicateQuery = query(
  ordersRef,
  where("phone", "==", normalizedPhone),
  where("status", "==", "en-attente"),
  limit(1)
);

const duplicateSnapshot = await getDocs(duplicateQuery);

if (!duplicateSnapshot.empty) {
  order.confirmationStatus = "Double";
}

// 🔁 Enrich each article with depot info
const enrichedArticles = await Promise.all(
  order.articles.map(async (article: any) => {
    try {
      const variantRef = doc(firestore, "Products", article.product_id.toString(), "variants", article.variant_id.toString());
      const variantSnap = await getDoc(variantRef);

      if (variantSnap.exists()) {
        const variantData = variantSnap.data();
        if (Array.isArray(variantData.depots) && variantData.depots.length > 0) {
          article.depot = variantData.depots[0];
        }
      }
    } catch (err) {
      console.warn(`Failed to fetch depot for variant ${article.variant_id}:`, err);
    }

    return article;
  })
);

order.articles = enrichedArticles;

// 🔁 Generate order reference
const depots = enrichedArticles
  .map((a) => a.depot)
  .filter((d) => d && d.id); // only valid depots

order.orderReference = generateReferenceFromDepots(depots);

// 🔁 Save both raw and enriched orders
await addDoc(collection(firestore, "Orders"), {...orderData,slug:productData.slug}); // Shopify raw order
await addDoc(collection(firestore, "orders"), {...order,slug:productData.slug});     // enriched internal order
if (typeof window !== "undefined") {
  if (window.fbq) {
    window.fbq("track", "Purchase", {

      
      value: grandTotal,
      currency: "DZD",
      content_type: "product",
      content_ids: [productData.productId?.toString()],
    });
  }
   if (window.ttq) {
  window.ttq.track("CompletePayment", {
    content_type: "product",
    content_id: productData.productId?.toString(), // ✅ required
    value: grandTotal,
    currency: "DZD",
  });
}

}
const total = order.totalPrice;

router.push(
  `/thank-you?name=${encodeURIComponent(order.name)}&phone=${encodeURIComponent(order.phone)}&product=${encodeURIComponent(productData.productTitle)}&color=${encodeURIComponent(selectedColor)}&size=${encodeURIComponent(selectedSize)}&qty=${quantity}&price=${productData.priceAfter}&&shipping=${order.deliveryPrice}&total=${grandTotal}&delivery=${encodeURIComponent(order.deliveryType)}`);
 setShowThankYou(true)
} catch (error) {
  console.error("Error adding document:", error)
  alert("حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى.")
} finally {
  setIsSubmitting(false)
}

  }

  const handleThumbnailScroll = (direction: "left" | "right") => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200
      thumbnailContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }


  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-300 to-yellow-400 px-4 py-3">
        <div className="max-w-7xl mx-auto">

          {/* Discount timer row */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-sm font-medium">
              <span>🔥</span>
              <span>{productDataa.discountTimer.message}</span>
              <div className="flex items-center gap-1 bg-black/20 rounded px-2 py-1">
                <span>{timeLeft.hours.toString().padStart(2, "0")}</span>
                <span>:</span>
                <span>{timeLeft.minutes.toString().padStart(2, "0")}</span>
                <span>:</span>
                <span>{timeLeft.seconds.toString().padStart(2, "0")}</span>
              </div>
              <span>⏰</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-6 ">
            <div className="relative group">
              <div
                className="aspect-square bg-white dark:bg-slate-800 rounded-2xl overflow-hidden cursor-zoom-in shadow-lg hover:shadow-xl transition-all duration-500"
                onClick={() => handleImageZoom(currentColorObj?.imageUrl)}
              >
                <Image
                  src={currentColorObj?.imageUrl || "/placeholder.svg"}
                  alt={`${productData.title} - ${selectedColor}`}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={`absolute top-4 right-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 ${
                  isLiked ? "text-red-500" : "text-gray-400 dark:text-stone-400"
                }`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <LucideIcons.Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              </Button>
            </div>

            <div className="relative">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-700 shadow-md"
                onClick={() => handleThumbnailScroll("left")}
              >
                <LucideIcons.ChevronLeft className="h-4 w-4" />
              </Button>
              <div ref={thumbnailContainerRef} className="flex overflow-x-auto gap-3 py-2 px-12 scrollbar-hide">
                {productData?.colorImages.map((thumbnail: any, index: number) => (
                  <div
                    key={index}
                    className="aspect-square w-1/4 flex-shrink-0 bg-white dark:bg-slate-800 rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    onClick={() => handleImageZoom(thumbnail?.imageUrl || "/placeholder.svg")}
                  >
                    <Image
                      src={thumbnail?.imageUrl? thumbnail?.imageUrl: "/placeholder.svg"}
                      alt={`${selectedColor} variant ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-700 shadow-md"
                onClick={() => handleThumbnailScroll("right")}
              >
                <LucideIcons.ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product Details */}
          <div className="order-2 lg:order-1 space-y-6">
            {/* Breadcrumb */}
           
            {/* Product Title */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">{productData.productTitle}</h1>
            </div>

            {/* Rating and Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">{productData.priceAfter}د.ج</span>
                <span className="text-lg text-gray-400 line-through">{productData.priceBefore}د.ج</span>
              </div>
            </div>

            {/* Purchase Options */}
            <div className="space-y-4">
              <p className="text-sm text-gray-600">{productDataa.form.orderInstructions}</p>

              {/* Name Field */}
              <div className="space-y-1">
                <div className="flex items-center gap-3">
               
                  <Input
                    placeholder={productDataa.form.nameLabel}
                    className={`flex-1 text-right ${errors.name ? "border-red-500" : ""}`}
                    required     value={name}
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm text-right">{errors.name}</p>}
              </div>

              {/* Phone Number Field */}
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                 
      <Input
  type="tel"
  inputMode="numeric"
  placeholder={productDataa.form.phoneLabel}
  className={`flex-1 text-right ${errors.phone ? "border-red-500" : ""}`}
  required
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
/>
                </div>
                {errors.phone && <p className="text-red-500 text-sm text-right">{errors.phone}</p>}
              </div>

              {/* Wilaya Select */}
              <div className="space-y-1">
                <div className="flex items-center gap-3">  
                  <Select
                   value={selectedProvince.toString()}
                   onValueChange={(value) => {
                     setSelectedProvince(value)
                     setSelectedCommune("")
                   }}
                   required
                  >
                    <SelectTrigger className={`flex-1 text-right ${errors.wilaya ? "border-red-500" : ""}`}>
                      <SelectValue placeholder={productDataa.form.wilayaLabel} />
                    </SelectTrigger>
                    <SelectContent>
                    {wilayass.map((wilaya: any) => (
                <SelectItem key={wilaya.id} value={wilaya.id.toString()}>
                  {wilaya.id} - {wilaya.name}
                </SelectItem>
              ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.wilaya && <p className="text-red-500 text-sm text-right">{errors.wilaya}</p>}
              </div>

              {/* Commune Select */}
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                 
                  <Select value={selectedCommune} onValueChange={setSelectedCommune} disabled={!selectedProvince} required>
                  <SelectTrigger className={`flex-1 text-right ${errors.commune ? "border-red-500" : ""}`}>
                      <SelectValue placeholder={productDataa.form.communeLabel} />
                    </SelectTrigger>
                    <SelectContent>
                    {comuness
                .filter((commune) => commune.wilaya_id.toString() === selectedProvince)
                .map((commune) => (
                  <SelectItem key={commune.id} value={commune.name}>
                    {commune.name}
                  </SelectItem>
                ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.commune && <p className="text-red-500 text-sm text-right">{errors.commune}</p>}
              </div>
<div className="space-y-2">
    <label className="block font-semibold text-right">نوع التوصيل</label>

 <div className={`space-y-3 ${errors.commune ? "border border-red-500 rounded-xl p-3" : ""}`}>
    {[
            {
              id: "domicile",
               name: "التوصيل للمنزل",
              description: "Livraison à votre adresse",
              cost: 400,
            },
            {
              id: "stopdesk",
                name: "نقطة الاستلام (StopDesk)",
              description: "Point de retrait",
              cost: 200,
              info: "Sélectionnez un point de retrait StopDesk près de chez vous après validation de la commande.",
            },
          ].map((method) => (
 <label
        key={method.id}
        className={`flex items-start gap-2 cursor-pointer p-2 border rounded-lg transition text-sm hover:shadow-sm ${
          selectedDeliveryMethod === method.id
            ? "border-purple-600 ring-1 ring-purple-300"
            : "border-gray-300 dark:border-gray-600"
        }`}
      >
        <input
          type="radio"
          name="delivery"
          value={method.id}
          checked={selectedDeliveryMethod === method.id}
          onChange={() => setSelectedDeliveryMethod(method.id)}
          className="mt-1 accent-purple-600"
          required
        />
        <div className="flex-1 text-right space-y-0.5">
          <div className="font-semibold text-gray-900 dark:text-white">{method.name}</div>
          <div className="text-xs mt-0.5 text-gray-700 dark:text-stone-300">+ دج {deliveryPrices[method.id]}</div>
        </div>
      </label>
    ))}
  </div>
                {errors.commune && <p className="text-red-500 text-sm text-right">{errors.commune}</p>}
              </div>
            </div>

            <div className="bg-stone-50 dark:bg-slate-800/50 p-4 rounded-xl">
        <h4 className="font-semibold text-lg mb-4">Résumé de commande</h4>

        <div className="flex gap-4 mb-4">
          {/* Product Details - Left Side */}
          <div className="flex-1 space-y-3">


            {/* Color Selection Dropdown */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">Couleur /اللون:</Label>
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue placeholder="Sélectionner couleur" />
                </SelectTrigger>
                <SelectContent>
                  {productData.colorImages.map((color: any) => (
                    <SelectItem key={color.color} value={color.color}>
                      {color.color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Size Selection Dropdown */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">Pointure /المقاس:</Label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue placeholder="Sélectionner pointure" />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map((size: string) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity Selection */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">Quantité /الكمية:</Label>
              <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-md w-24 overflow-hidden">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 rounded-none border-0 hover:bg-stone-100 dark:hover:bg-slate-700 p-0"
                  onClick={() => handleQuantityChange(-1)}
                >
                  <LucideIcons.Minus className="w-3 h-3" />
                </Button>
                <div className="flex-1 text-center text-sm font-semibold py-1 px-1">{quantity}</div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 rounded-none border-0 hover:bg-stone-100 dark:hover:bg-slate-700 p-0"
                  onClick={() => handleQuantityChange(1)}
                >
                  <LucideIcons.Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Product Image - Right Side */}
          <div className="flex-shrink-0">
            <div
              className="w-20 h-20 bg-white dark:bg-slate-700 rounded-lg overflow-hidden cursor-zoom-in shadow-md hover:shadow-lg transition-all duration-300 group"
              onClick={() => setIsZoomed(true)}
            >
              <Image
                src={currentColorObj?.imageUrl || "/placeholder.svg"}
                alt={`${productData.title} - ${selectedColor}`}
                width={80}
                height={80}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
            {/* Purchase Button */}
            <Button
              id="main-order-button"
                  type="submit"
              className={`w-full py-3 text-lg rounded-full ${ "bg-purple-500 hover:bg-purple-600 text-white"}`}
              disabled={isSubmitting}
              onClick={handleFormSubmit}
       
            >
              {isSubmitting ? (
      <>
        <LucideIcons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Traitement...
      </>
    ) : (
      <> {productDataa.buttons.orderNow}</>
    )}
             
            </Button>

            {/* Shipping Info */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <LucideIcons.Truck className="w-5 h-5 text-gray-600" />
                </div>
                <div className="text-sm">
                  <div className="font-medium">{productDataa.shipping.freeShipping}</div>
                  <div className="font-medium">{productDataa.shipping.freeShippingDesc}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

 {productData?.promoImages?.map((url, index) => (
      <img
        key={index}
        src={url}
        alt={`Promo ${index + 1}`}
        className="w-full mb-4 rounded-xl shadow-md mt-8"
      />
    ))}


        {/* Promotional Banner */}
        <div className="relative bg-gradient-to-r from-purple-900 to-purple-800 rounded-2xl overflow-hidden text-white text-center py-12 px-6 mt-8">
          <div className="relative z-10">
            <div className="mb-6">
              <Image
                src={currentColorObj?.imageUrl}
                alt="White pants promotional"
                width={150}
                height={200}
                className="mx-auto rounded-lg"
              />
            </div>

            <h2 className="text-2xl font-bold mb-4">{productDataa.promotion.title}</h2>
            <p className="text-purple-200 mb-6">{productDataa.promotion.description}</p>

            {/* Countdown Timer */}
            <div className="flex justify-center gap-4 mb-8">
              <div className="bg-black/30 rounded-full w-16 h-16 flex flex-col items-center justify-center">
                <span className="text-xl font-bold">{timeLeft.days.toString().padStart(2, "0")}</span>
                <span className="text-xs">{productDataa.discountTimer.labels.days}</span>
              </div>
              <div className="bg-black/30 rounded-full w-16 h-16 flex flex-col items-center justify-center">
                <span className="text-xl font-bold">{timeLeft.hours.toString().padStart(2, "0")}</span>
                <span className="text-xs">{productDataa.discountTimer.labels.hours}</span>
              </div>
              <div className="bg-black/30 rounded-full w-16 h-16 flex flex-col items-center justify-center">
                <span className="text-xl font-bold">{timeLeft.minutes.toString().padStart(2, "0")}</span>
                <span className="text-xs">{productDataa.discountTimer.labels.minutes}</span>
              </div>
              <div className="bg-black/30 rounded-full w-16 h-16 flex flex-col items-center justify-center">
                <span className="text-xl font-bold">{timeLeft.seconds.toString().padStart(2, "0")}</span>
                <span className="text-xs">{productDataa.discountTimer.labels.seconds}</span>
              </div>
            </div>

            <Button className="bg-purple-500 hover:bg-purple-400 text-white px-12 py-3 rounded-full text-lg font-medium">
              {productDataa.buttons.getItNow}
            </Button>

            <p className="text-purple-200 text-sm mt-4">{productDataa.promotion.guarantee}</p>
          </div>
        </div>

        {/* Customer Images Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8">{productDataa.testimonials.title}</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {productData?.testimonials.map((image, index) => (
              <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={image.reviewImage || "/placeholder.svg"}
                  alt={`Customer photo ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Always Visible Bottom Order Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
        <div className="max-w-md mx-auto">
        <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-white border-b pb-2 mb-2">
    <div className="flex flex-col items-start w-1/3">
      <span className="text-m text-gray-500">سعر المنتج</span>
      <span className="text-blue-700 dark:text-blue-400 text-lg">{productTotal} د.ج</span>
    </div>
    <div className="flex flex-col items-center w-1/3">
      <span className="text-m text-gray-500">سعر التوصيل</span>
      <span className="text-blue-700 dark:text-blue-400 text-lg">
        {shippingCost ? `${shippingCost} د.ج` : "N/A"}
      </span>
    </div>
    <div className="flex flex-col items-end w-1/3">
      <span className="text-m font-bold text-red-600"> سعر الاجمالي (د.ج)</span>
      <span className="text-blue-700 dark:text-blue-400 text-lg">{grandTotal} د.ج</span>
    </div>
  </div>
        <Button
  className={`
    w-full py-3 rounded-full 
    bg-purple-500 hover:bg-purple-600 text-white 
    transition-all duration-300 
    animate-bounceOnce 
    shadow-lg hover:shadow-xl
  `}
  onClick={handleFormSubmit}
  type="submit"
  disabled={isSubmitting}
>
  {isSubmitting ? (
    <>
      <LucideIcons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
      جاري المعالجة...
    </>
  ) : (
    <>{productDataa.buttons.orderNow}</>
  )}
</Button>
        </div>
      </div>


      <Footer facebookUrl={productData.facebookUrl} instagramUrl={productData.instagramUrl} />
      <WhatsAppButton />
              {isZoomed && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <div className="relative max-w-4xl max-h-full">
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-12 right-0 text-white hover:bg-white/20 z-10"
                onClick={() => setIsZoomed(false)}
              >
                <LucideIcons.X className="w-6 h-6" />
              </Button>
              <Image
                src={zoomedImage || "/placeholder.svg"}
                alt="Zoomed product image"
                width={800}
                height={800}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      <div className="h-24"></div>

<style jsx>{`
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out;
  }
`}</style>
    </div>
  )
}
