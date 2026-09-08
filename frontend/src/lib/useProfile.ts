"use client";

import { useState, useEffect } from 'react';

export type BidderProfile = {
  companyName: string;
  email: string;
  gstn: string;
  udyam: string;
  pan: string;
  turnover: string;
  address: string;
};

const defaultProfile: BidderProfile = {
  companyName: '',
  email: '',
  gstn: '',
  udyam: '',
  pan: '',
  turnover: '',
  address: ''
};

export function useProfile() {
  const [profile, setProfileState] = useState<BidderProfile>(defaultProfile);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('gem_verify_bidder_profile');
    if (saved) {
      try {
        setProfileState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const setProfile = (newProfile: BidderProfile) => {
    setProfileState(newProfile);
    localStorage.setItem('gem_verify_bidder_profile', JSON.stringify(newProfile));
  };

  return { profile, setProfile, isLoaded };
}
