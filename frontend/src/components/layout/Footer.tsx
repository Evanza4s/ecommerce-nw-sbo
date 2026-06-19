"use client"

import Link from "next/link";
import Image from "next/image";

import LogoEC from "@/assets/images/logo_e-commerce.png";
import { YoutubeIcon } from "@/assets/icons/YoutubeIcon";
import { FacebookIcon } from "@/assets/icons/FacebookIcon";
import { TwitterIcon } from "@/assets/icons/TwitterIcon";
import { InstagramIcon } from "@/assets/icons/InstagramIcon";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-light/10 bg-dark">

      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 lg:px-20">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">

          <div className="lg:col-span-2">

            <Image
              src={LogoEC}
              alt="E-Commerce Logo"
              width={140}
              height={60}
              className="h-auto w-auto bg-light p-4 rounded-2xl"
            />

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-light">
              Discover premium fashion and lifestyle products
              with a modern shopping experience designed for
              everyone.
            </p>

            <div className="mt-6 flex items-center gap-3">

              <Link
                href="#"
                aria-label="Facebook"
                className="rounded-xl border border-light p-2 transition hover:bg-primary hover:text-white"
              >
                <YoutubeIcon className="h-6 w-6 text-light" />
              </Link>

              <Link
                href="#"
                aria-label="Instagram"
                className="rounded-xl border border-light p-2 transition hover:bg-primary hover:text-white"
              >
                <FacebookIcon className="h-6 w-6 text-light" />
              </Link>

              <Link
                href="#"
                aria-label="Twitter"
                className="rounded-xl border border-light p-2 transition hover:bg-primary hover:text-white"
              >
                <TwitterIcon className="h-6 w-6 text-light" />
              </Link>

              <Link
                href="#"
                aria-label="YouTube"
                className="rounded-xl border border-light p-2 transition hover:bg-primary hover:text-white"
              >
                <InstagramIcon className="h-6 w-6 text-light" />
              </Link>

            </div>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-light">
              Shop
            </h3>

            <ul className="space-y-3 text-sm text-light/70">

              <li>
                <Link href="#">
                  Men
                </Link>
              </li>

              <li>
                <Link href="#">
                  Women
                </Link>
              </li>

              <li>
                <Link href="#">
                  Kids
                </Link>
              </li>

              <li>
                <Link href="#">
                  Sport
                </Link>
              </li>

            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-light">
              Support
            </h3>

            <ul className="space-y-3 text-sm text-light/70">

              <li>
                <Link href="#">
                  FAQ
                </Link>
              </li>

              <li>
                <Link href="#">
                  Contact Us
                </Link>
              </li>

              <li>
                <Link href="#">
                  Shipping
                </Link>
              </li>

              <li>
                <Link href="#">
                  Returns
                </Link>
              </li>

            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-light">
              Company
            </h3>

            <ul className="space-y-3 text-sm text-light/70">

              <li>
                <Link href="#">
                  About Us
                </Link>
              </li>

              <li>
                <Link href="#">
                  Careers
                </Link>
              </li>

              <li>
                <Link href="#">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="#">
                  Terms & Conditions
                </Link>
              </li>

            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-light/10 pt-6 text-sm text-light/60 md:flex-row">

          <p>
            © {new Date().getFullYear()} E-Commerce.
            All rights reserved.
          </p>

          <div className="flex items-center gap-6">

            <Link href="#">
              Privacy Policy
            </Link>

            <Link href="#">
              Terms of Service
            </Link>

            <Link href="#">
              Cookies Policy
            </Link>

          </div>
        </div>
      </div>
    </footer>
  );
};


export default Footer;
