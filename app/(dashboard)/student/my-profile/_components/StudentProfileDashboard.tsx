"use client";

import React, { useMemo, useState } from "react";
import { ProfileHeader, type ProfileData } from "./ProfileHeader";
import { ContactInfo, type ContactData } from "./ContactInfo";
import { SocialLinks, type SocialLinksData } from "./SocialLinks";
import { EducationSection, type EducationItem } from "./EducationSection";
import { ExperienceSection, type ExperienceItem } from "./ExperienceSection";
import { SkillsSection, type SkillItem } from "./SkillsSection";
import { TokenInfo } from "./TokenInfo";

type Props = {
  user: {
    name?: string | null;
    email?: string | null;
    username?: string | null;
    picture?: string | null;
    phone?: string | null;
  };
  accessToken: string | null;
  idToken: string | null;
  decodedIdClaims: Record<string, unknown> | null;
};

export default function StudentProfileDashboard({
  user,
  accessToken,
  idToken,
  decodedIdClaims,
}: Props) {
  console.log("user", user);
  const initialProfile: ProfileData = useMemo(
    () => ({
      name: user.name || user.username || "Student",
      title: "Student",
      bio: "",
      avatar: user.picture || undefined,
    }),
    [user]
  );

  const initialContact: ContactData = useMemo(
    () => ({
      email: user?.email || "",
      phone: user?.phone || "",
      location: "",
    }),
    [user]
  );

  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [contact, setContact] = useState<ContactData>(initialContact);
  const [socialLinks, setSocialLinks] = useState<SocialLinksData>({
    github: "",
    linkedin: "",
    website: "",
  });
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);

  const [editingProfile, setEditingProfile] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [profileEditData, setProfileEditData] = useState<ProfileData>(profile);
  const [contactEditData, setContactEditData] = useState<ContactData>(contact);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
      <div className="mx-auto space-y-6">
        <ProfileHeader
          profile={profile}
          isEditing={editingProfile}
          editData={profileEditData}
          setEditData={setProfileEditData}
          onEdit={() => {
            setEditingProfile(true);
            setProfileEditData(profile);
          }}
          onSave={() => {
            setProfile(profileEditData);
            setEditingProfile(false);
          }}
          onCancel={() => setEditingProfile(false)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="space-y-4 sm:space-y-6">
            <ContactInfo
              contact={contact}
              isEditing={editingContact}
              editData={contactEditData}
              setEditData={setContactEditData}
              onEdit={() => {
                setEditingContact(true);
                setContactEditData(contact);
              }}
              onSave={() => {
                setContact(contactEditData);
                setEditingContact(false);
              }}
              onCancel={() => setEditingContact(false)}
            />
            <SocialLinks links={socialLinks} onUpdate={setSocialLinks} />
            <SkillsSection
              skills={skills}
              onAdd={(skill) => setSkills((prev) => [...prev, skill])}
              onDelete={(id) =>
                setSkills((prev) => prev.filter((s) => s.id !== id))
              }
            />
          </div>

          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <EducationSection
              education={education}
              onAdd={(edu) => setEducation((prev) => [...prev, edu])}
              onEdit={(id, data) =>
                setEducation((prev) =>
                  prev.map((e) => (e.id === id ? { ...data, id } : e))
                )
              }
              onDelete={(id) =>
                setEducation((prev) => prev.filter((e) => e.id !== id))
              }
            />
            <ExperienceSection
              experience={experience}
              onAdd={(exp) => setExperience((prev) => [...prev, exp])}
              onEdit={(id, data) =>
                setExperience((prev) =>
                  prev.map((e) => (e.id === id ? { ...data, id } : e))
                )
              }
              onDelete={(id) =>
                setExperience((prev) => prev.filter((e) => e.id !== id))
              }
            />
            <TokenInfo
              idToken={idToken}
              accessToken={accessToken}
              decodedIdClaims={decodedIdClaims}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
