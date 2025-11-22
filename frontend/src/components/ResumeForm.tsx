import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

export interface ResumeData {
  name: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  education: {
    university: string;
    degree: string;
    location: string;
    graduationDate: string;
    coursework: string;
  }[];
  skills: {
    languages: string;
    frameworks: string;
    tools: string;
  };
  experience: {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    achievements: string[];
  }[];
  projects: {
    name: string;
    techStack: string;
    url: string;
    descriptions: string[];
  }[];
}

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export function ResumeForm({ data, onChange }: ResumeFormProps) {
  const updateField = (field: keyof ResumeData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addEducation = () => {
    updateField("education", [
      ...data.education,
      { university: "", degree: "", location: "", graduationDate: "", coursework: "" },
    ]);
  };

  const removeEducation = (index: number) => {
    updateField(
      "education",
      data.education.filter((_, i) => i !== index)
    );
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...data.education];
    updated[index] = { ...updated[index], [field]: value };
    updateField("education", updated);
  };

  const addExperience = () => {
    updateField("experience", [
      ...data.experience,
      { title: "", company: "", location: "", startDate: "", endDate: "", achievements: [""] },
    ]);
  };

  const removeExperience = (index: number) => {
    updateField(
      "experience",
      data.experience.filter((_, i) => i !== index)
    );
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...data.experience];
    updated[index] = { ...updated[index], [field]: value };
    updateField("experience", updated);
  };

  const addExperienceAchievement = (expIndex: number) => {
    const updated = [...data.experience];
    updated[expIndex].achievements.push("");
    updateField("experience", updated);
  };

  const removeExperienceAchievement = (expIndex: number, achIndex: number) => {
    const updated = [...data.experience];
    updated[expIndex].achievements = updated[expIndex].achievements.filter((_, i) => i !== achIndex);
    updateField("experience", updated);
  };

  const updateExperienceAchievement = (expIndex: number, achIndex: number, value: string) => {
    const updated = [...data.experience];
    updated[expIndex].achievements[achIndex] = value;
    updateField("experience", updated);
  };

  const addProject = () => {
    updateField("projects", [
      ...data.projects,
      { name: "", techStack: "", url: "", descriptions: [""] },
    ]);
  };

  const removeProject = (index: number) => {
    updateField(
      "projects",
      data.projects.filter((_, i) => i !== index)
    );
  };

  const updateProject = (index: number, field: string, value: any) => {
    const updated = [...data.projects];
    updated[index] = { ...updated[index], [field]: value };
    updateField("projects", updated);
  };

  const addProjectDescription = (projIndex: number) => {
    const updated = [...data.projects];
    updated[projIndex].descriptions.push("");
    updateField("projects", updated);
  };

  const removeProjectDescription = (projIndex: number, descIndex: number) => {
    const updated = [...data.projects];
    updated[projIndex].descriptions = updated[projIndex].descriptions.filter((_, i) => i !== descIndex);
    updateField("projects", updated);
  };

  const updateProjectDescription = (projIndex: number, descIndex: number, value: string) => {
    const updated = [...data.projects];
    updated[projIndex].descriptions[descIndex] = value;
    updateField("projects", updated);
  };

  return (
    <div className="space-y-8">
      {/* Contact Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+1 (123) 456-7890"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="john@example.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={data.linkedin}
                onChange={(e) => updateField("linkedin", e.target.value)}
                placeholder="linkedin.com/in/johndoe"
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={data.github}
                onChange={(e) => updateField("github", e.target.value)}
                placeholder="github.com/johndoe"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Education */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Education</h2>
          <Button onClick={addEducation} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>
        <div className="space-y-6">
          {data.education.map((edu, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3 bg-muted/30">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Education {index + 1}</h3>
                <Button
                  onClick={() => removeEducation(index)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>University</Label>
                  <Input
                    value={edu.university}
                    onChange={(e) => updateEducation(index, "university", e.target.value)}
                    placeholder="MIT"
                  />
                </div>
                <div>
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, "degree", e.target.value)}
                    placeholder="B.S. in Computer Science"
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={edu.location}
                    onChange={(e) => updateEducation(index, "location", e.target.value)}
                    placeholder="Cambridge, MA"
                  />
                </div>
                <div>
                  <Label>Graduation Date</Label>
                  <Input
                    value={edu.graduationDate}
                    onChange={(e) => updateEducation(index, "graduationDate", e.target.value)}
                    placeholder="May 2024"
                  />
                </div>
              </div>
              <div>
                <Label>Relevant Coursework</Label>
                <Input
                  value={edu.coursework}
                  onChange={(e) => updateEducation(index, "coursework", e.target.value)}
                  placeholder="Data Structures, Algorithms, Machine Learning"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Technical Skills */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Technical Skills</h2>
        <div className="space-y-4">
          <div>
            <Label>Languages</Label>
            <Input
              value={data.skills.languages}
              onChange={(e) => updateField("skills", { ...data.skills, languages: e.target.value })}
              placeholder="Python, JavaScript, Java, C++"
            />
          </div>
          <div>
            <Label>Frameworks/Libraries/Databases</Label>
            <Input
              value={data.skills.frameworks}
              onChange={(e) => updateField("skills", { ...data.skills, frameworks: e.target.value })}
              placeholder="React, Node.js, PostgreSQL, MongoDB"
            />
          </div>
          <div>
            <Label>Tools and Technologies</Label>
            <Input
              value={data.skills.tools}
              onChange={(e) => updateField("skills", { ...data.skills, tools: e.target.value })}
              placeholder="Git, Docker, AWS, Linux"
            />
          </div>
        </div>
      </Card>

      {/* Experience */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Experience</h2>
          <Button onClick={addExperience} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>
        <div className="space-y-6">
          {data.experience.map((exp, expIndex) => (
            <div key={expIndex} className="p-4 border rounded-lg space-y-3 bg-muted/30">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Experience {expIndex + 1}</h3>
                <Button
                  onClick={() => removeExperience(expIndex)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Job Title</Label>
                  <Input
                    value={exp.title}
                    onChange={(e) => updateExperience(expIndex, "title", e.target.value)}
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(expIndex, "company", e.target.value)}
                    placeholder="Tech Corp"
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={exp.location}
                    onChange={(e) => updateExperience(expIndex, "location", e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div>
                  <Label>Date Range</Label>
                  <div className="flex gap-2">
                    <Input
                      value={exp.startDate}
                      onChange={(e) => updateExperience(expIndex, "startDate", e.target.value)}
                      placeholder="Jan 2023"
                      className="flex-1"
                    />
                    <span className="self-center">–</span>
                    <Input
                      value={exp.endDate}
                      onChange={(e) => updateExperience(expIndex, "endDate", e.target.value)}
                      placeholder="Present"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Achievements/Responsibilities</Label>
                  <Button
                    onClick={() => addExperienceAchievement(expIndex)}
                    variant="ghost"
                    size="sm"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {exp.achievements.map((achievement, achIndex) => (
                    <div key={achIndex} className="flex gap-2">
                      <Input
                        value={achievement}
                        onChange={(e) =>
                          updateExperienceAchievement(expIndex, achIndex, e.target.value)
                        }
                        placeholder="Developed and deployed..."
                      />
                      <Button
                        onClick={() => removeExperienceAchievement(expIndex, achIndex)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Projects */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Projects</h2>
          <Button onClick={addProject} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
        <div className="space-y-6">
          {data.projects.map((proj, projIndex) => (
            <div key={projIndex} className="p-4 border rounded-lg space-y-3 bg-muted/30">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Project {projIndex + 1}</h3>
                <Button
                  onClick={() => removeProject(projIndex)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Project Name</Label>
                  <Input
                    value={proj.name}
                    onChange={(e) => updateProject(projIndex, "name", e.target.value)}
                    placeholder="AI Chatbot"
                  />
                </div>
                <div>
                  <Label>Tech Stack</Label>
                  <Input
                    value={proj.techStack}
                    onChange={(e) => updateProject(projIndex, "techStack", e.target.value)}
                    placeholder="React, Node.js, OpenAI"
                  />
                </div>
              </div>
              <div>
                <Label>URL (GitHub/Demo)</Label>
                <Input
                  value={proj.url}
                  onChange={(e) => updateProject(projIndex, "url", e.target.value)}
                  placeholder="https://github.com/user/project"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Descriptions</Label>
                  <Button
                    onClick={() => addProjectDescription(projIndex)}
                    variant="ghost"
                    size="sm"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {proj.descriptions.map((desc, descIndex) => (
                    <div key={descIndex} className="flex gap-2">
                      <Input
                        value={desc}
                        onChange={(e) =>
                          updateProjectDescription(projIndex, descIndex, e.target.value)
                        }
                        placeholder="Built a chatbot that..."
                      />
                      <Button
                        onClick={() => removeProjectDescription(projIndex, descIndex)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
