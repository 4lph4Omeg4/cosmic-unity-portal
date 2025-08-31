import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Instagram, Youtube, Linkedin, Link, ExternalLink, X } from 'lucide-react'

export default function SocialsStep() {
  const { watch, setValue } = useFormContext()
  const socials = watch('socials') || {}

  const socialPlatforms = [
    {
      key: 'X',
      label: 'X (Twitter)',
      icon: X,
      color: 'text-black',
      description: 'Deel je updates en connect met anderen'
    },
    {
      key: 'Facebook',
      label: 'Facebook',
      icon: ExternalLink,
      color: 'text-blue-600',
      description: 'Deel je content en connect met je community'
    },
    {
      key: 'Instagram',
      label: 'Instagram',
      icon: Instagram,
      color: 'text-pink-500',
      description: 'Toon je visuele werk en verhalen'
    },
    {
      key: 'TikTok',
      label: 'TikTok',
      icon: ExternalLink,
      color: 'text-black',
      description: 'Deel korte video content en trends'
    },
    {
      key: 'YouTube',
      label: 'YouTube',
      icon: Youtube,
      color: 'text-red-500',
      description: 'Deel video content en tutorials'
    },
    {
      key: 'LinkedIn',
      label: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-600',
      description: 'Professionele netwerking en updates'
    }
  ]

  const handleConnect = (platform: string) => {
    // Dummy handler voor toekomstige connect functionaliteit
    console.log(`Connecting to ${platform}...`)
  }

  const handleCheckboxChange = (platform: string, checked: boolean) => {
    setValue(`socials.${platform}`, checked)
  }

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Connect je social media
        </CardTitle>
        <p className="text-gray-600">
          Kies welke platforms je wilt koppelen (optioneel)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {socialPlatforms.map((platform, index) => {
          const IconComponent = platform.icon
          const isChecked = socials[platform.key as keyof typeof socials] || false
          
          return (
            <div key={platform.key} className="space-y-3">
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox
                  id={platform.key}
                  checked={isChecked}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(platform.key, checked as boolean)
                  }
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <IconComponent className={`w-5 h-5 ${platform.color}`} />
                    <label 
                      htmlFor={platform.key}
                      className="font-medium text-gray-900 cursor-pointer"
                    >
                      {platform.label}
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {platform.description}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleConnect(platform.key)}
                  disabled={!isChecked}
                  className="flex items-center space-x-2"
                >
                  {isChecked ? (
                    <>
                      <Link className="w-4 h-4" />
                      <span>Connect</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      <span>Later</span>
                    </>
                  )}
                </Button>
              </div>
              
              {index < socialPlatforms.length - 1 && (
                <Separator className="my-2" />
              )}
            </div>
          )
        })}

        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            Je kunt deze platforms later altijd nog koppelen vanuit je profiel
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
