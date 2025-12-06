"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// removed static avatar import; using string path in student.profileImage instead
// Local types for this page
interface SocialLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentId: string;
  department: string; // course name
  semester: string; // module name
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  enrollmentDate: string;
  profileImage: string;
  cgpa?: number; // used to derive assessment score
  creditsCompleted?: number; // used as modules completed
  attendance: number;
  bio?: string;
  skills?: string[];
  socialLinks?: SocialLinks;
}

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  studentId: string;
  department: string;
  semester: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  bio: string;
  skills: string[];
  socialLinks: SocialLinks;
}

// Icons (you can use Lucide React icons)
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  GraduationCap,
  Github,
  Linkedin,
  Globe,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";

const mockStudent: Student = {
  id: "1",
  name: "Md. Arif Hossain",
  email: "arif.hossain@example.com",
  phone: "+1 (555) 123-4567",
  studentId: "STU2024001",
  department: "Advance Air Ticketing & Visa Processing",
  semester: "Module 2",
  dateOfBirth: "2002-05-15",
  address: "123 University Ave, Campus City, State 12345",
  emergencyContact: "+1 (555) 987-6543",
  enrollmentDate: "2023-09-01",
  profileImage: "/images/dashboard/avater.png",
  cgpa: 3.8,
  creditsCompleted: 65,
  attendance: 92,
  bio: "Aspiring travel and visa consultant specializing in airline GDS systems, itinerary planning, visa documentation, and customer service. Focused on mastering industry standards and real-world workflows.",
  skills: [
    "Amadeus",
    "Galileo",
    "Sabre",
    "Itinerary Planning",
    "Visa Documentation",
    "IATA Regulations",
    "Customer Service",
  ],
  socialLinks: {
    github: "github.com/johndoe",
    linkedin: "linkedin.com/in/johndoe",
    portfolio: "johndoe.dev",
  },
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [student, setStudent] = useState<Student>(mockStudent);
  const [newSkill, setNewSkill] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const [formData, setFormData] = useState<ProfileFormData>({
    name: student.name,
    email: student.email,
    phone: student.phone,
    studentId: student.studentId,
    department: student.department,
    semester: student.semester,
    dateOfBirth: student.dateOfBirth,
    address: student.address,
    emergencyContact: student.emergencyContact,
    bio: student.bio || "",
    skills: student.skills || [],
    socialLinks: {
      github: student.socialLinks?.github || "",
      linkedin: student.socialLinks?.linkedin || "",
      portfolio: student.socialLinks?.portfolio || "",
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: ProfileFormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData((prev: ProfileFormData) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev: ProfileFormData) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev: ProfileFormData) => ({
      ...prev,
      skills: prev.skills.filter((skill: string) => skill !== skillToRemove),
    }));
  };

  const handleSave = () => {
    setStudent((prev: Student) => ({
      ...prev,
      ...formData,
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      studentId: student.studentId,
      department: student.department,
      semester: student.semester,
      dateOfBirth: student.dateOfBirth,
      address: student.address,
      emergencyContact: student.emergencyContact,
      bio: student.bio || "",
      skills: student.skills || [],
      socialLinks: {
        github: student.socialLinks?.github || "",
        linkedin: student.socialLinks?.linkedin || "",
        portfolio: student.socialLinks?.portfolio || "",
      },
    });
    setIsEditing(false);
  };

  // removed initials helper since we now render a direct Image

  return (
    <div className="py-8 px-4">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
              Advance Air Ticketing & Visa Processing
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your course-related and personal information
            </p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2 mt-4 lg:mt-0">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <CardContent className="pt-8 pb-6 text-center">
                <div className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-lg rounded-full overflow-hidden">
                  <Image
                    src={student.profileImage}
                    alt={student.name}
                    width={96}
                    height={96}
                    sizes="96px"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-xl">{student.name}</CardTitle>
                <CardDescription className="mb-3">
                  {student.studentId}
                </CardDescription>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 max-w-full break-words text-center"
                >
                  {student.department}
                </Badge>

                <Separator className="my-4" />

                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm min-w-0">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{student.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <span>{student.semester} Semester</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Progress */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Course Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Assessment Score</span>
                    <span className="font-semibold">
                      {Math.round(((student.cgpa || 0) / 4) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={Math.round(((student.cgpa || 0) / 4) * 100)}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Modules Completed</span>
                    <span className="font-semibold">
                      {student.creditsCompleted}/8
                    </span>
                  </div>
                  <Progress
                    value={((student.creditsCompleted || 0) / 8) * 100}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Class Attendance</span>
                    <span className="font-semibold">{student.attendance}%</span>
                  </div>
                  <Progress value={student.attendance} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {student.socialLinks?.github && (
                  <div className="flex items-center gap-3 text-sm min-w-0">
                    <Github className="w-4 h-4" />
                    <a
                      href={`https://${student.socialLinks.github}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {student.socialLinks.github}
                    </a>
                  </div>
                )}
                {student.socialLinks?.linkedin && (
                  <div className="flex items-center gap-3 text-sm min-w-0">
                    <Linkedin className="w-4 h-4" />
                    <a
                      href={`https://${student.socialLinks.linkedin}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {student.socialLinks.linkedin}
                    </a>
                  </div>
                )}
                {student.socialLinks?.portfolio && (
                  <div className="flex items-center gap-3 text-sm min-w-0">
                    <Globe className="w-4 h-4" />
                    <a
                      href={`https://${student.socialLinks.portfolio}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {student.socialLinks.portfolio}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-3 md:grid-cols-3 gap-2 overflow-x-auto md:overflow-visible whitespace-nowrap px-1">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="academic">Course</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Bio Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    ) : (
                      <p className="text-gray-700 leading-relaxed break-words">
                        {student.bio}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Skills Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Technologies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Add a skill..."
                            onKeyDown={(e) => e.key === "Enter" && addSkill()}
                          />
                          <Button onClick={addSkill} size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.skills.map(
                            (skill: string, index: number) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="gap-1"
                              >
                                {skill}
                                <button
                                  onClick={() => removeSkill(skill)}
                                  className="hover:text-red-500"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {student.skills?.map((skill: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Personal Info Tab */}
              <TabsContent value="personal" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal & Course Information</CardTitle>
                    <CardDescription>
                      Update your contact and course-related details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-md min-w-0">
                            <span>{student.name}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-md min-w-0">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span>{student.email}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-2 border rounded-md min-w-0">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span>{student.phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">
                          Emergency Contact
                        </Label>
                        {isEditing ? (
                          <Input
                            id="emergencyContact"
                            name="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-2 border rounded-md min-w-0">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span>{student.emergencyContact}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      {isEditing ? (
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-2 border rounded-md min-w-0 break-words">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{student.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Social Links Editing */}
                    {isEditing && (
                      <div className="space-y-4 pt-4">
                        <Label>Social Links</Label>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="github">GitHub</Label>
                            <Input
                              id="github"
                              value={formData.socialLinks.github}
                              onChange={(e) =>
                                handleSocialLinkChange("github", e.target.value)
                              }
                              placeholder="github.com/username"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input
                              id="linkedin"
                              value={formData.socialLinks.linkedin}
                              onChange={(e) =>
                                handleSocialLinkChange(
                                  "linkedin",
                                  e.target.value
                                )
                              }
                              placeholder="linkedin.com/in/username"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="portfolio">Portfolio</Label>
                            <Input
                              id="portfolio"
                              value={formData.socialLinks.portfolio}
                              onChange={(e) =>
                                handleSocialLinkChange(
                                  "portfolio",
                                  e.target.value
                                )
                              }
                              placeholder="yourportfolio.com"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Academic Tab */}
              <TabsContent value="academic">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Information</CardTitle>
                    <CardDescription>
                      Your course details and progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Enrollment ID</Label>
                        {isEditing ? (
                          <Input
                            id="studentId"
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="p-2 border rounded-md">
                            <span>{student.studentId}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department">Course</Label>
                        {isEditing ? (
                          <Input
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="p-2 border rounded-md">
                            <span>{student.department}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="semester">Module</Label>
                        {isEditing ? (
                          <Input
                            id="semester"
                            name="semester"
                            value={formData.semester}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="p-2 border rounded-md">
                            <span>{student.semester}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        {isEditing ? (
                          <Input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-2 border rounded-md">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>
                              {new Date(
                                student.dateOfBirth
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-semibold">Course Statistics</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-blue-600">
                              {Math.round(((student.cgpa || 0) / 4) * 100)}%
                            </div>
                            <p className="text-sm text-gray-600">
                              Assessment Score
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-green-600">
                              {student.creditsCompleted}
                            </div>
                            <p className="text-sm text-gray-600">
                              Modules Completed
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-orange-600">
                              {student.attendance}%
                            </div>
                            <p className="text-sm text-gray-600">
                              Class Attendance
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
