import { getDialCodeByIso, splitPhoneNumber } from "@/constants/phonePrefixes";
import {
  UPDATE_BUSINESS_PROFILE,
  UPDATE_PERSON_PROFILE,
  UPDATE_SELLER,
} from "@/graphql/auth/profile";
import useAuthStore, {
  useBusinessProfile,
  useCoverImage,
  useInitials,
  usePersonProfile,
  useProfileImage,
  useSeller,
} from "@/store/useAuthStore";
import { useConfirmedLocation } from "@/store/useLocationStore";
import type { BusinessProfile, PersonProfile, Seller } from "@/types/user";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import type { BusinessFormValues } from "../ui/editProfile/BusinessInfoForm";
import type { ContactFormValues } from "../ui/editProfile/ContactForm";
import type { LocationFormValues } from "../ui/editProfile/LocationForm";
import type { PersonFormValues } from "../ui/editProfile/PersonInfoForm";

export default function useProfileData() {
  const router = useRouter();
  const seller = useSeller();
  const confirmedLocation = useConfirmedLocation();
  const profileImage = useProfileImage();
  const coverImage = useCoverImage();
  const initials = useInitials();
  const refreshSeller = useAuthStore((s) => s.refreshSeller);

  // ── Derived profile references ──────────────────────────────────────────────
  const personProfile = usePersonProfile();
  const bizProfile = useBusinessProfile();

  // ── Redirect if unauthenticated ─────────────────────────────────────────────
  useEffect(() => {
    if (!seller) {
      router.replace("/(auth)");
    }
  }, [seller]);

  // ── Person form state ───────────────────────────────────────────────────────
  const [personValues, setPersonValues] = useState<PersonFormValues>({
    firstName: personProfile?.firstName ?? "",
    lastName: personProfile?.lastName ?? "",
    displayName: personProfile?.displayName ?? "",
    bio: personProfile?.bio ?? "",
    birthday: personProfile?.birthday ?? "",
    allowExchanges: personProfile?.allowExchanges ?? true,
  });

  // ── Business form state ─────────────────────────────────────────────────────
  const [bizValues, setBizValues] = useState<BusinessFormValues>({
    businessName: bizProfile?.businessName ?? "",
    description: bizProfile?.description ?? "",
    businessType: bizProfile?.businessType ?? "",
    legalBusinessName: bizProfile?.legalBusinessName ?? "",
    taxId: bizProfile?.taxId ?? "",
    businessStartDate: bizProfile?.businessStartDate ?? "",
    legalRepresentative: bizProfile?.legalRepresentative ?? "",
    legalRepresentativeTaxId: bizProfile?.legalRepresentativeTaxId ?? "",
    shippingPolicy: bizProfile?.shippingPolicy ?? "",
    returnPolicy: bizProfile?.returnPolicy ?? "",
    serviceArea: bizProfile?.serviceArea ?? "",
    yearsOfExperience: String(bizProfile?.yearsOfExperience ?? ""),
    travelRadius: String(bizProfile?.travelRadius ?? ""),
  });

  // ── Contact form state ──────────────────────────────────────────────────────
  const { prefix: parsedPrefix, number: parsedNumber } = splitPhoneNumber(
    seller?.phone ?? "",
  );
  const defaultPrefix =
    parsedPrefix || getDialCodeByIso(confirmedLocation?.isoCode ?? "");

  const [contactValues, setContactValues] = useState<ContactFormValues>({
    phone: parsedNumber,
    phonePrefix: defaultPrefix,
    website: seller?.website ?? "",
    preferredContactMethod: seller?.preferredContactMethod ?? "",
    instagram: seller?.socialMediaLinks?.["instagram"] ?? "",
    facebook: seller?.socialMediaLinks?.["facebook"] ?? "",
    tiktok: seller?.socialMediaLinks?.["tiktok"] ?? "",
    linkedin: seller?.socialMediaLinks?.["linkedin"] ?? "",
  });

  // ── Location form state ─────────────────────────────────────────────────────
  const [locationValues, setLocationValues] = useState<LocationFormValues>({
    countryId: seller?.country?.id ?? null,
    regionId: seller?.region?.id ?? null,
    cityId: seller?.city?.id ?? null,
    countyId: seller?.county?.id ?? null,
    address: seller?.address ?? "",
  });

  // Sync location state once seller data is available (handles async hydration)
  useEffect(() => {
    if (!seller) return;
    setLocationValues({
      countryId: seller.country?.id ?? null,
      regionId: seller.region?.id ?? null,
      cityId: seller.city?.id ?? null,
      countyId: seller.county?.id ?? null,
      address: seller.address ?? "",
    });
  }, [seller?.id]);

  const handleLocationChange = <K extends keyof LocationFormValues>(
    key: K,
    value: number | string | null,
  ) => {
    setLocationValues((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "countryId") {
        next.regionId = null;
        next.cityId = null;
        next.countyId = null;
      } else if (key === "regionId") {
        next.cityId = null;
        next.countyId = null;
      } else if (key === "cityId") {
        next.countyId = null;
      }
      return next;
    });
  };

  // ── Mutations ───────────────────────────────────────────────────────────────
  const [updateSeller, { loading: sellerLoading }] = useMutation<{
    updateSeller: Seller;
  }>(UPDATE_SELLER);
  const [updatePersonProfile, { loading: personLoading }] = useMutation<{
    updatePersonProfile: PersonProfile;
  }>(UPDATE_PERSON_PROFILE);
  const [updateBusinessProfile, { loading: bizLoading }] = useMutation<{
    updateBusinessProfile: BusinessProfile;
  }>(UPDATE_BUSINESS_PROFILE);

  const isSaving = sellerLoading || personLoading || bizLoading;

  const handleSave = async () => {
    if (!seller) return;

    try {
      const {
        instagram,
        facebook,
        tiktok,
        linkedin,
        preferredContactMethod,
        phonePrefix,
        phone,
        ...sellerContact
      } = contactValues;

      const sellerPromise = updateSeller({
        variables: {
          input: {
            ...sellerContact,
            phone: phonePrefix ? `${phonePrefix}${phone}` : phone,
            preferredContactMethod: preferredContactMethod || undefined,
            socialMediaLinks: { instagram, facebook, tiktok, linkedin },
            ...locationValues,
          },
        },
      });

      type ProfileResult =
        | Awaited<ReturnType<typeof updatePersonProfile>>
        | Awaited<ReturnType<typeof updateBusinessProfile>>
        | undefined;

      let profilePromise: Promise<ProfileResult>;

      if (personProfile) {
        const { birthday, ...personRest } = personValues;
        profilePromise = updatePersonProfile({
          variables: {
            input: {
              ...personRest,
              birthday: birthday || undefined,
            },
          },
        });
      } else if (bizProfile) {
        const { yearsOfExperience, travelRadius, businessType, ...bizRest } =
          bizValues;
        profilePromise = updateBusinessProfile({
          variables: {
            input: {
              ...bizRest,
              businessType: businessType || undefined,
              yearsOfExperience: yearsOfExperience
                ? Number(yearsOfExperience)
                : undefined,
              travelRadius: travelRadius ? Number(travelRadius) : undefined,
            },
          },
        });
      } else {
        profilePromise = Promise.resolve(undefined);
      }

      const [sellerResult, profileResult] = await Promise.all([
        sellerPromise,
        profilePromise,
      ]);

      // ── Merge results back into the auth store ──────────────────────────────
      const updatedSeller = sellerResult.data?.updateSeller;

      let updatedProfile: PersonProfile | BusinessProfile = seller.profile;
      const profileData = profileResult?.data;
      if (
        profileData &&
        "updatePersonProfile" in profileData &&
        profileData.updatePersonProfile
      ) {
        updatedProfile = profileData.updatePersonProfile;
      } else if (
        profileData &&
        "updateBusinessProfile" in profileData &&
        profileData.updateBusinessProfile
      ) {
        updatedProfile = profileData.updateBusinessProfile;
      }

      await refreshSeller({
        ...seller,
        ...(updatedSeller ?? {}),
        profile: updatedProfile,
      });

      router.back();
    } catch (e) {
      console.error("Save profile failed:", e);
    }
  };

  return {
    seller,
    profileImage,
    coverImage,
    initials,
    personProfile,
    bizProfile,
    personValues,
    bizValues,
    contactValues,
    locationValues,
    isSaving,
    setPersonValues,
    setBizValues,
    setContactValues,
    handleLocationChange,
    handleSave,
  };
}
