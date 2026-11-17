"use client";

import {
  AdminActionForm,
  SubmitButton,
} from "@/features/admin/components/admin-flash";
import {
  CheckboxField,
  TextareaField,
  TextField,
} from "@/features/admin/components/field";
import { saveSiteProfile } from "@/actions/admin/settings";
import {
  deleteCertification,
  deleteEducation,
  deleteExperience,
  saveCertification,
  saveEducation,
  saveExperience,
} from "@/actions/admin/portfolio";
import { DeleteForm } from "@/features/admin/components/inbox-row-actions";
import type {
  CertificationRow,
  EducationRow,
  ExperienceRow,
} from "@/types/database";

type ProfileValue = {
  name?: string;
  headline?: string;
  shortBio?: string;
  longBio?: string[] | string;
  focusAreas?: string[];
  availabilityNote?: string;
};

export function SiteProfileForm({ value }: { value?: ProfileValue | null }) {
  const longBio = Array.isArray(value?.longBio)
    ? value?.longBio.join("\n\n")
    : value?.longBio ?? "";

  return (
    <AdminActionForm action={saveSiteProfile} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Name" name="name" defaultValue={value?.name} required />
        <TextField
          label="Headline"
          name="headline"
          defaultValue={value?.headline}
          required
        />
      </div>
      <TextareaField
        label="Short bio"
        name="shortBio"
        defaultValue={value?.shortBio}
        rows={3}
        required
      />
      <TextareaField
        label="Long bio"
        name="longBio"
        defaultValue={longBio}
        rows={8}
        hint="Separate paragraphs with blank lines."
      />
      <TextField
        label="Focus areas"
        name="focusAreas"
        defaultValue={value?.focusAreas?.join(", ")}
      />
      <TextField
        label="Availability note"
        name="availabilityNote"
        defaultValue={value?.availabilityNote}
      />
      <SubmitButton>Save profile</SubmitButton>
    </AdminActionForm>
  );
}

export function ExperienceForm({ item }: { item?: ExperienceRow | null }) {
  return (
    <AdminActionForm action={saveExperience} className="space-y-3">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField label="Company" name="company" defaultValue={item?.company} required />
        <TextField label="Role" name="role" defaultValue={item?.role} required />
        <TextField label="Location" name="location" defaultValue={item?.location} />
        <TextField
          label="Sort order"
          name="sort_order"
          type="number"
          defaultValue={item?.sort_order ?? 0}
        />
        <TextField
          label="Start"
          name="start_label"
          defaultValue={item?.start_label}
          required
        />
        <TextField
          label="End"
          name="end_label"
          defaultValue={item?.end_label}
          required
        />
      </div>
      <TextareaField label="Summary" name="summary" defaultValue={item?.summary} rows={3} />
      <TextareaField
        label="Highlights"
        name="highlights"
        defaultValue={item?.highlights?.join("\n")}
        rows={4}
        hint="One highlight per line"
      />
      <CheckboxField label="Published" name="published" defaultChecked={item?.published} />
      <SubmitButton size="sm">{item ? "Save" : "Add experience"}</SubmitButton>
    </AdminActionForm>
  );
}

export function EducationForm({ item }: { item?: EducationRow | null }) {
  return (
    <AdminActionForm action={saveEducation} className="space-y-3">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField
          label="Institution"
          name="institution"
          defaultValue={item?.institution}
          required
        />
        <TextField
          label="Credential"
          name="credential"
          defaultValue={item?.credential}
          required
        />
        <TextField label="Field" name="field" defaultValue={item?.field} />
        <TextField
          label="Sort order"
          name="sort_order"
          type="number"
          defaultValue={item?.sort_order ?? 0}
        />
        <TextField label="Start" name="start_label" defaultValue={item?.start_label} />
        <TextField label="End" name="end_label" defaultValue={item?.end_label} />
      </div>
      <TextareaField label="Summary" name="summary" defaultValue={item?.summary} rows={3} />
      <CheckboxField label="Published" name="published" defaultChecked={item?.published} />
      <SubmitButton size="sm">{item ? "Save" : "Add education"}</SubmitButton>
    </AdminActionForm>
  );
}

export function CertificationForm({ item }: { item?: CertificationRow | null }) {
  return (
    <AdminActionForm action={saveCertification} className="space-y-3">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField label="Name" name="name" defaultValue={item?.name} required />
        <TextField label="Issuer" name="issuer" defaultValue={item?.issuer} required />
        <TextField
          label="Issued"
          name="issued_label"
          defaultValue={item?.issued_label}
        />
        <TextField
          label="Credential ID"
          name="credential_id"
          defaultValue={item?.credential_id}
        />
        <TextField label="URL" name="url" defaultValue={item?.url} />
        <TextField
          label="Sort order"
          name="sort_order"
          type="number"
          defaultValue={item?.sort_order ?? 0}
        />
      </div>
      <CheckboxField label="Published" name="published" defaultChecked={item?.published} />
      <SubmitButton size="sm">{item ? "Save" : "Add certification"}</SubmitButton>
    </AdminActionForm>
  );
}

export function ExperienceList({ rows }: { rows: ExperienceRow[] }) {
  return (
    <div className="space-y-6">
      {rows.map((row) => (
        <div key={row.id} className="space-y-3 border-t border-border/60 pt-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">
              {row.role} · {row.company}
            </p>
            <DeleteForm id={row.id} action={deleteExperience} />
          </div>
          <ExperienceForm item={row} />
        </div>
      ))}
      <div className="border-t border-border/60 pt-4">
        <p className="mb-3 text-sm font-medium">Add experience</p>
        <ExperienceForm />
      </div>
    </div>
  );
}

export function EducationList({ rows }: { rows: EducationRow[] }) {
  return (
    <div className="space-y-6">
      {rows.map((row) => (
        <div key={row.id} className="space-y-3 border-t border-border/60 pt-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">
              {row.credential} · {row.institution}
            </p>
            <DeleteForm id={row.id} action={deleteEducation} />
          </div>
          <EducationForm item={row} />
        </div>
      ))}
      <div className="border-t border-border/60 pt-4">
        <p className="mb-3 text-sm font-medium">Add education</p>
        <EducationForm />
      </div>
    </div>
  );
}

export function CertificationList({ rows }: { rows: CertificationRow[] }) {
  return (
    <div className="space-y-6">
      {rows.map((row) => (
        <div key={row.id} className="space-y-3 border-t border-border/60 pt-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">
              {row.name} · {row.issuer}
            </p>
            <DeleteForm id={row.id} action={deleteCertification} />
          </div>
          <CertificationForm item={row} />
        </div>
      ))}
      <div className="border-t border-border/60 pt-4">
        <p className="mb-3 text-sm font-medium">Add certification</p>
        <CertificationForm />
      </div>
    </div>
  );
}
